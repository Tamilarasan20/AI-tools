import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@loraloop/database';
import { createHash } from 'crypto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly prisma = new PrismaClient();

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers?.['x-api-key'] as string | undefined;
    if (apiKey) {
      return this.validateApiKey(request, apiKey);
    }

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('jwt.secret'),
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async validateApiKey(request: any, rawKey: string): Promise<boolean> {
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const key = await this.prisma.apiKey.findFirst({
      where: { keyHash, deletedAt: null },
      include: {
        org: {
          include: { members: { where: { accepted: true }, orderBy: { createdAt: 'asc' }, take: 1 } },
        },
      },
    });

    if (!key) throw new UnauthorizedException('Invalid API key');
    if (key.expiresAt && key.expiresAt < new Date()) throw new UnauthorizedException('API key expired');

    await this.prisma.apiKey.update({ where: { id: key.id }, data: { lastUsed: new Date() } });

    const firstMember = key.org?.members[0];
    const userId = firstMember?.userId ?? 'api-key';
    request.user = { userId, sub: userId };
    return true;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return request.cookies?.accessToken || null;
  }
}
