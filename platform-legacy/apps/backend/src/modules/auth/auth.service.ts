import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@loraloop/database';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthTokens,
} from '@loraloop/shared';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateSlug } from '../../common/utils/slug';

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verifyToken = uuidv4();

    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          passwordHash,
          verifyToken,
          provider: 'LOCAL',
        },
      });

      const slug = await this.uniqueSlug(tx, dto.name);
      const org = await tx.organization.create({
        data: { name: `${dto.name}'s Organization`, slug },
      });

      await tx.orgMember.create({
        data: { orgId: org.id, userId: newUser.id, role: 'OWNER', accepted: true },
      });

      await tx.subscription.create({
        data: { orgId: org.id, plan: 'FREE', period: 'MONTHLY' },
      });

      return newUser;
    });

    return this.generateTokens(user.id);
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (user.deletedAt) throw new UnauthorizedException('Account deactivated');

    return this.generateTokens(user.id);
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({ where: { userId, token: refreshToken } });
    } else {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }
  }

  async refresh(token: string): Promise<AuthTokens> {
    const record = await this.prisma.refreshToken.findUnique({ where: { token } });
    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    await this.prisma.refreshToken.delete({ where: { id: record.id } });
    return this.generateTokens(record.userId);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return; // Silent — don't expose email existence

    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 3600 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpiry },
    });

    const resetUrl = `${this.config.get('app.frontendUrl')}/reset-password?token=${resetToken}`;
    const resendKey = this.config.get<string>('resend.apiKey');
    if (resendKey) {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'noreply@loraloop.com',
        to: user.email,
        subject: 'Reset your Loraloop password',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
      });
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetExpiry: { gt: new Date() },
      },
    });
    if (!user) throw new BadRequestException('Invalid or expired reset token');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetExpiry: null },
    });
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, avatar: true,
        provider: true, emailVerified: true, timezone: true,
        isSuperAdmin: true, createdAt: true,
        orgMembers: {
          where: { accepted: true },
          include: { org: { select: { id: true, name: true, slug: true, logo: true } } },
        },
      },
    });
  }

  async generateTokens(userId: string): Promise<AuthTokens> {
    const secret = this.config.get<string>('jwt.secret');
    const refreshSecret = this.config.get<string>('jwt.refreshSecret');

    const accessToken = await this.jwtService.signAsync(
      { userId, sub: userId },
      { secret, expiresIn: '15m' },
    );

    const refreshTokenValue = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days

    await this.prisma.refreshToken.create({
      data: { token: refreshTokenValue, userId, expiresAt },
    });

    return { accessToken, refreshToken: refreshTokenValue, expiresIn: 900 };
  }

  private async uniqueSlug(tx: any, name: string): Promise<string> {
    let slug = generateSlug(name);
    let attempt = 0;
    while (true) {
      const candidate = attempt === 0 ? slug : `${slug}-${attempt}`;
      const exists = await tx.organization.findUnique({ where: { slug: candidate } });
      if (!exists) return candidate;
      attempt++;
    }
  }
}
