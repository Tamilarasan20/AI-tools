import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@loraloop/database';

@Injectable()
export class OrgMemberGuard implements CanActivate {
  private readonly prisma = new PrismaClient();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const orgId = request.params?.orgId || request.body?.orgId;

    if (!orgId) return true;

    const member = await this.prisma.orgMember.findUnique({
      where: { orgId_userId: { orgId, userId } },
      include: { org: { select: { deletedAt: true } } },
    });

    if (!member || !member.accepted) {
      throw new ForbiddenException('You are not a member of this organization');
    }
    if (member.org.deletedAt) {
      throw new NotFoundException('Organization not found');
    }

    request.user.orgId = orgId;
    request.user.role = member.role;
    return true;
  }
}
