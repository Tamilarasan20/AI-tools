import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@loraloop/database';
import { Platform, UpdateIntegrationDto, PLAN_LIMITS } from '@loraloop/shared';
import { encrypt, decrypt } from '../../common/utils/encryption';
import axios from 'axios';
import IORedis from 'ioredis';

@Injectable()
export class IntegrationsService {
  private readonly prisma = new PrismaClient();

  constructor(private readonly config: ConfigService) {}

  async list(orgId: string) {
    return this.prisma.integration.findMany({
      where: { orgId, deletedAt: null },
      select: {
        id: true, platform: true, accountId: true, accountName: true,
        accountPicture: true, disabled: true, createdAt: true, tokenExpiry: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOAuthUrl(platform: Platform, orgId: string, userId: string): Promise<string> {
    await this.checkIntegrationLimit(orgId);
    const state = `${orgId}:${userId}:${Date.now()}`;
    await this.storeState(state, { orgId, userId, platform });

    const callbackUrl = `${this.config.get('app.backendUrl')}/api/oauth/${platform}/callback`;

    switch (platform) {
      case Platform.TWITTER: {
        const clientId = this.config.get<string>('oauth.twitter.clientId');
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: clientId!,
          redirect_uri: callbackUrl,
          scope: 'tweet.read tweet.write users.read offline.access',
          state,
          code_challenge: 'challenge',
          code_challenge_method: 'plain',
        });
        return `https://twitter.com/i/oauth2/authorize?${params}`;
      }
      case Platform.LINKEDIN_PERSONAL:
      case Platform.LINKEDIN_PAGE: {
        const clientId = this.config.get<string>('oauth.linkedin.clientId');
        const params = new URLSearchParams({
          response_type: 'code',
          client_id: clientId!,
          redirect_uri: callbackUrl,
          scope: 'openid profile email w_member_social',
          state,
        });
        return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
      }
      case Platform.INSTAGRAM:
      case Platform.FACEBOOK: {
        const appId = this.config.get<string>('oauth.meta.appId');
        const scopes = platform === Platform.INSTAGRAM
          ? 'instagram_basic,instagram_content_publish,pages_read_engagement'
          : 'pages_manage_posts,pages_read_engagement';
        const params = new URLSearchParams({
          client_id: appId!,
          redirect_uri: callbackUrl,
          scope: scopes,
          state,
          response_type: 'code',
        });
        return `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
      }
      default:
        throw new BadRequestException(`OAuth not implemented for platform: ${platform}`);
    }
  }

  async handleCallback(platform: Platform, code: string, state: string) {
    const stored = await this.getState(state);
    if (!stored) throw new BadRequestException('Invalid or expired OAuth state');

    const { orgId, userId } = stored;
    const callbackUrl = `${this.config.get('app.backendUrl')}/api/oauth/${platform}/callback`;

    let accessToken: string;
    let refreshToken: string | undefined;
    let tokenExpiry: Date | undefined;
    let accountId: string;
    let accountName: string;
    let accountPicture: string | undefined;

    switch (platform) {
      case Platform.TWITTER: {
        const clientId = this.config.get<string>('oauth.twitter.clientId');
        const clientSecret = this.config.get<string>('oauth.twitter.clientSecret');
        const tokenRes = await axios.post(
          'https://api.twitter.com/2/oauth2/token',
          new URLSearchParams({ code, grant_type: 'authorization_code', redirect_uri: callbackUrl, code_verifier: 'challenge' }),
          { auth: { username: clientId!, password: clientSecret! } },
        );
        accessToken = tokenRes.data.access_token;
        refreshToken = tokenRes.data.refresh_token;
        if (tokenRes.data.expires_in) tokenExpiry = new Date(Date.now() + tokenRes.data.expires_in * 1000);

        const userRes = await axios.get('https://api.twitter.com/2/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { 'user.fields': 'profile_image_url,name,username' },
        });
        accountId = userRes.data.data.id;
        accountName = userRes.data.data.name;
        accountPicture = userRes.data.data.profile_image_url;
        break;
      }
      case Platform.LINKEDIN_PERSONAL: {
        const clientId = this.config.get<string>('oauth.linkedin.clientId');
        const clientSecret = this.config.get<string>('oauth.linkedin.clientSecret');
        const tokenRes = await axios.post(
          'https://www.linkedin.com/oauth/v2/accessToken',
          new URLSearchParams({ code, grant_type: 'authorization_code', redirect_uri: callbackUrl, client_id: clientId!, client_secret: clientSecret! }),
        );
        accessToken = tokenRes.data.access_token;
        if (tokenRes.data.expires_in) tokenExpiry = new Date(Date.now() + tokenRes.data.expires_in * 1000);

        const profileRes = await axios.get('https://api.linkedin.com/v2/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        accountId = profileRes.data.id;
        accountName = `${profileRes.data.localizedFirstName} ${profileRes.data.localizedLastName}`;
        break;
      }
      default: {
        throw new BadRequestException(`Callback not implemented for platform: ${platform}`);
      }
    }

    await this.prisma.integration.upsert({
      where: { orgId_platform_accountId: { orgId, platform, accountId } },
      create: {
        orgId, platform, accountId, accountName,
        accountPicture: accountPicture || null,
        accessToken: encrypt(accessToken),
        refreshToken: refreshToken ? encrypt(refreshToken) : null,
        tokenExpiry,
      },
      update: {
        accountName, accountPicture: accountPicture || null,
        accessToken: encrypt(accessToken),
        refreshToken: refreshToken ? encrypt(refreshToken) : null,
        tokenExpiry, disabled: false, deletedAt: null,
      },
    });

    return `${this.config.get('app.frontendUrl')}/settings/integrations?connected=${platform}`;
  }

  async update(orgId: string, integrationId: string, dto: UpdateIntegrationDto) {
    await this.findOrFail(orgId, integrationId);
    return this.prisma.integration.update({ where: { id: integrationId }, data: dto as any });
  }

  async disconnect(orgId: string, integrationId: string) {
    await this.findOrFail(orgId, integrationId);
    await this.prisma.integration.update({
      where: { id: integrationId },
      data: { deletedAt: new Date() },
    });
  }

  private async findOrFail(orgId: string, id: string) {
    const integration = await this.prisma.integration.findFirst({
      where: { id, orgId, deletedAt: null },
    });
    if (!integration) throw new NotFoundException('Integration not found');
    return integration;
  }

  private async checkIntegrationLimit(orgId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { orgId } });
    const plan = sub?.plan || 'FREE';
    const limits = PLAN_LIMITS[plan];
    if (limits.integrations === -1) return;

    const count = await this.prisma.integration.count({ where: { orgId, deletedAt: null } });
    if (count >= limits.integrations) {
      throw new ForbiddenException(`Integration limit (${limits.integrations}) reached. Upgrade your plan.`);
    }
  }

  private getRedis(): IORedis {
    const redisUrl = this.config.get<string>('redis.url') || 'redis://localhost:6379';
    return new IORedis(redisUrl, { maxRetriesPerRequest: 3 });
  }

  private async storeState(state: string, data: any) {
    const redis = this.getRedis();
    await redis.setex(`oauth_state:${state}`, 600, JSON.stringify(data));
    redis.disconnect();
  }

  private async getState(state: string): Promise<any> {
    const redis = this.getRedis();
    const raw = await redis.get(`oauth_state:${state}`);
    if (raw) await redis.del(`oauth_state:${state}`);
    redis.disconnect();
    return raw ? JSON.parse(raw) : null;
  }
}
