import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@loraloop/database';
import { AnalyticsQueryDto } from '@loraloop/shared';

@Injectable()
export class AnalyticsService {
  private readonly prisma = new PrismaClient();

  async get(orgId: string, query: AnalyticsQueryDto) {
    const where: any = {
      integration: { orgId, deletedAt: null },
    };
    if (query.integrationId) where.integrationId = query.integrationId;
    if (query.from || query.to) {
      where.date = {};
      if (query.from) where.date.gte = new Date(query.from);
      if (query.to) where.date.lte = new Date(query.to);
    }

    return this.prisma.integrationAnalytics.findMany({
      where,
      include: { integration: { select: { platform: true, accountName: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async overview(orgId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [postsThisMonth, scheduledPosts, integrations, analytics, aiUsage] = await Promise.all([
      this.prisma.post.count({
        where: { orgId, state: 'PUBLISHED', createdAt: { gte: monthStart }, deletedAt: null },
      }),
      this.prisma.post.count({ where: { orgId, state: 'SCHEDULED', deletedAt: null } }),
      this.prisma.integration.count({ where: { orgId, deletedAt: null, disabled: false } }),
      this.prisma.integrationAnalytics.aggregate({
        where: {
          integration: { orgId },
          date: { gte: monthStart },
        },
        _sum: { impressions: true, engagements: true, likes: true, followers: true },
      }),
      this.prisma.aiUsage.aggregate({
        where: { orgId, createdAt: { gte: monthStart } },
        _sum: { credits: true },
      }),
    ]);

    return {
      postsThisMonth,
      scheduledPosts,
      activeIntegrations: integrations,
      impressions: analytics._sum.impressions || 0,
      engagements: analytics._sum.engagements || 0,
      likes: analytics._sum.likes || 0,
      followersGained: analytics._sum.followers || 0,
      aiCreditsUsed: aiUsage._sum.credits || 0,
    };
  }
}
