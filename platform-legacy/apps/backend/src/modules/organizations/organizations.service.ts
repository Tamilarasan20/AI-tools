import {
  Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@loraloop/database';
import { CreateOrgDto, UpdateOrgDto, InviteMemberDto, UpdateMemberRoleDto, OrgRole } from '@loraloop/shared';
import { generateSlug } from '../../common/utils/slug';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrganizationsService {
  private readonly prisma = new PrismaClient();

  constructor(private readonly config: ConfigService) {}

  async create(userId: string, dto: CreateOrgDto) {
    const slug = dto.slug ? generateSlug(dto.slug) : await this.uniqueSlug(dto.name);
    const existing = await this.prisma.organization.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Organization slug already taken');

    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name: dto.name, slug, timezone: dto.timezone || 'UTC' },
      });
      await tx.orgMember.create({
        data: { orgId: org.id, userId, role: 'OWNER', accepted: true },
      });
      await tx.subscription.create({
        data: { orgId: org.id, plan: 'FREE', period: 'MONTHLY' },
      });
      return org;
    });
  }

  async listForUser(userId: string) {
    const members = await this.prisma.orgMember.findMany({
      where: { userId, accepted: true },
      include: {
        org: {
          include: { subscription: true, _count: { select: { members: true, integrations: true } } },
        },
      },
    });
    return members.map((m) => ({ ...m.org, role: m.role }));
  }

  async getOne(orgId: string, userId: string) {
    const org = await this.prisma.organization.findFirst({
      where: { id: orgId, deletedAt: null },
      include: {
        subscription: true,
        _count: { select: { members: true, integrations: true, posts: true } },
      },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(orgId: string, userId: string, role: OrgRole, dto: UpdateOrgDto) {
    if (role === 'MEMBER') throw new ForbiddenException('Insufficient permissions');
    if (dto.slug) {
      const slug = generateSlug(dto.slug);
      const conflict = await this.prisma.organization.findFirst({
        where: { slug, id: { not: orgId } },
      });
      if (conflict) throw new ConflictException('Slug already taken');
    }
    return this.prisma.organization.update({ where: { id: orgId }, data: dto });
  }

  async delete(orgId: string, role: OrgRole) {
    if (role !== 'OWNER') throw new ForbiddenException('Only owners can delete organizations');
    await this.prisma.organization.update({ where: { id: orgId }, data: { deletedAt: new Date() } });
  }

  async listMembers(orgId: string) {
    return this.prisma.orgMember.findMany({
      where: { orgId },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async inviteMember(orgId: string, role: OrgRole, dto: InviteMemberDto) {
    if (role === 'MEMBER') throw new ForbiddenException('Insufficient permissions');

    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const existingMember = existingUser
      ? await this.prisma.orgMember.findUnique({
          where: { orgId_userId: { orgId, userId: existingUser.id } },
        })
      : null;

    if (existingMember?.accepted) throw new ConflictException('User is already a member');

    const inviteToken = uuidv4();
    const org = await this.prisma.organization.findUnique({ where: { id: orgId } });

    if (existingUser) {
      await this.prisma.orgMember.upsert({
        where: { orgId_userId: { orgId, userId: existingUser.id } },
        create: { orgId, userId: existingUser.id, role: dto.role, inviteToken, inviteEmail: dto.email },
        update: { role: dto.role, inviteToken, accepted: false },
      });
    } else {
      const placeholderUser = await this.prisma.user.create({
        data: { email: dto.email, name: dto.email.split('@')[0], provider: 'LOCAL' },
      });
      await this.prisma.orgMember.create({
        data: { orgId, userId: placeholderUser.id, role: dto.role, inviteToken, inviteEmail: dto.email },
      });
    }

    const inviteUrl = `${this.config.get('app.frontendUrl')}/invite/${inviteToken}`;
    const resendKey = this.config.get<string>('resend.apiKey');
    if (resendKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'noreply@loraloop.com',
        to: dto.email,
        subject: `You've been invited to ${org?.name} on Loraloop`,
        html: `<p>You've been invited to join <strong>${org?.name}</strong> on Loraloop. <a href="${inviteUrl}">Accept invitation</a></p>`,
      });
    }

    return { message: 'Invitation sent' };
  }

  async acceptInvite(token: string, userId: string) {
    const member = await this.prisma.orgMember.findUnique({ where: { inviteToken: token } });
    if (!member) throw new NotFoundException('Invalid invite token');

    await this.prisma.orgMember.update({
      where: { id: member.id },
      data: { userId, accepted: true, inviteToken: null },
    });

    return this.prisma.organization.findUnique({ where: { id: member.orgId } });
  }

  async removeMember(orgId: string, memberId: string, requestingRole: OrgRole) {
    if (requestingRole === 'MEMBER') throw new ForbiddenException('Insufficient permissions');
    const member = await this.prisma.orgMember.findFirst({ where: { id: memberId, orgId } });
    if (!member) throw new NotFoundException('Member not found');
    if (member.role === 'OWNER') throw new ForbiddenException('Cannot remove the owner');
    await this.prisma.orgMember.delete({ where: { id: memberId } });
  }

  async updateMemberRole(orgId: string, memberId: string, requestingRole: OrgRole, dto: UpdateMemberRoleDto) {
    if (requestingRole !== 'OWNER') throw new ForbiddenException('Only owners can change roles');
    const member = await this.prisma.orgMember.findFirst({ where: { id: memberId, orgId } });
    if (!member) throw new NotFoundException('Member not found');
    if (member.role === 'OWNER' && dto.role !== 'OWNER') throw new BadRequestException('Cannot demote owner without transferring ownership');
    return this.prisma.orgMember.update({ where: { id: memberId }, data: { role: dto.role } });
  }

  private async uniqueSlug(name: string): Promise<string> {
    let slug = generateSlug(name);
    let attempt = 0;
    while (true) {
      const candidate = attempt === 0 ? slug : `${slug}-${attempt}`;
      const exists = await this.prisma.organization.findUnique({ where: { slug: candidate } });
      if (!exists) return candidate;
      attempt++;
    }
  }
}
