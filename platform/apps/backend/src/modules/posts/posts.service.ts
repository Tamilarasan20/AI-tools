import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaClient } from '@loraloop/database';
import {
  CreatePostDto, UpdatePostDto, SchedulePostDto, PostsQueryDto, PLAN_LIMITS,
} from '@loraloop/shared';

@Injectable()
export class PostsService {
  private readonly prisma = new PrismaClient();

  constructor(@InjectQueue('post-publishing') private readonly publishQueue: Queue) {}

  async create(orgId: string, dto: CreatePostDto) {
    await this.checkPostLimit(orgId);

    const post = await this.prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          orgId,
          content: dto.content,
          media: dto.media ? (dto.media as any) : undefined,
          settings: dto.settings ? (dto.settings as any) : undefined,
          state: dto.publishAt ? 'SCHEDULED' : 'DRAFT',
          publishAt: dto.publishAt ? new Date(dto.publishAt) : undefined,
          postIntegrations: {
            create: dto.integrationIds.map((integrationId) => ({
              integrationId,
              state: dto.publishAt ? 'SCHEDULED' : 'DRAFT',
            })),
          },
        },
        include: { postIntegrations: true, tags: { include: { tag: true } } },
      });

      if (dto.tagIds?.length) {
        await tx.postTag.createMany({
          data: dto.tagIds.map((tagId) => ({ postId: newPost.id, tagId })),
          skipDuplicates: true,
        });
      }

      return newPost;
    });

    if (dto.publishAt) {
      const delay = new Date(dto.publishAt).getTime() - Date.now();
      const job = await this.publishQueue.add(
        'publish-post',
        { postId: post.id },
        { delay: delay > 0 ? delay : 0, attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
      );
      await this.prisma.post.update({ where: { id: post.id }, data: { jobId: job.id } });
    }

    return this.prisma.post.findUnique({
      where: { id: post.id },
      include: { postIntegrations: true, tags: { include: { tag: true } } },
    });
  }

  async list(orgId: string, query: PostsQueryDto) {
    const { state, from, to, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { orgId, deletedAt: null };
    if (state) where.state = state;
    if (from || to) {
      where.publishAt = {};
      if (from) where.publishAt.gte = new Date(from);
      if (to) where.publishAt.lte = new Date(to);
    }

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          postIntegrations: {
            include: {
              integration: { select: { platform: true, accountName: true, accountPicture: true } },
            },
          },
          tags: { include: { tag: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getOne(orgId: string, postId: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, orgId, deletedAt: null },
      include: {
        postIntegrations: { include: { integration: true } },
        tags: { include: { tag: true } },
      },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(orgId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.getOne(orgId, postId);
    if (post.state === 'PUBLISHED') throw new BadRequestException('Cannot edit a published post');

    if (post.jobId && dto.publishAt) {
      const job = await this.publishQueue.getJob(post.jobId);
      if (job) await job.remove();
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.post.update({
        where: { id: postId },
        data: {
          ...(dto.content !== undefined && { content: dto.content }),
          ...(dto.media !== undefined && { media: dto.media as any }),
          ...(dto.settings !== undefined && { settings: dto.settings as any }),
          ...(dto.publishAt !== undefined && { publishAt: dto.publishAt ? new Date(dto.publishAt) : null }),
          state: dto.publishAt ? 'SCHEDULED' : 'DRAFT',
        },
      });

      if (dto.integrationIds) {
        await tx.postIntegration.deleteMany({ where: { postId } });
        await tx.postIntegration.createMany({
          data: dto.integrationIds.map((integrationId) => ({
            postId,
            integrationId,
            state: dto.publishAt ? 'SCHEDULED' : 'DRAFT',
          })),
        });
      }

      return updated;
    });
  }

  async delete(orgId: string, postId: string) {
    const post = await this.getOne(orgId, postId);
    if (post.jobId) {
      const job = await this.publishQueue.getJob(post.jobId);
      if (job) await job.remove();
    }
    await this.prisma.post.update({ where: { id: postId }, data: { deletedAt: new Date() } });
  }

  async schedule(orgId: string, postId: string, dto: SchedulePostDto) {
    const post = await this.getOne(orgId, postId);
    if (post.state === 'PUBLISHED') throw new BadRequestException('Post already published');

    if (post.jobId) {
      const job = await this.publishQueue.getJob(post.jobId);
      if (job) await job.remove();
    }

    const publishAt = new Date(dto.publishAt);
    const delay = publishAt.getTime() - Date.now();

    const job = await this.publishQueue.add(
      'publish-post',
      { postId },
      { delay: delay > 0 ? delay : 0, attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
    );

    return this.prisma.post.update({
      where: { id: postId },
      data: { publishAt, state: 'SCHEDULED', jobId: job.id },
    });
  }

  async publishNow(orgId: string, postId: string) {
    await this.getOne(orgId, postId);
    await this.publishQueue.add('publish-post', { postId }, { attempts: 3 });
    return this.prisma.post.update({ where: { id: postId }, data: { state: 'PUBLISHING' } });
  }

  async cancel(orgId: string, postId: string) {
    const post = await this.getOne(orgId, postId);
    if (post.jobId) {
      const job = await this.publishQueue.getJob(post.jobId);
      if (job) await job.remove();
    }
    return this.prisma.post.update({
      where: { id: postId },
      data: { state: 'CANCELED', jobId: null },
    });
  }

  private async checkPostLimit(orgId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { orgId } });
    const plan = sub?.plan || 'FREE';
    const limits = PLAN_LIMITS[plan];
    if (limits.postsPerMonth === -1) return;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const count = await this.prisma.post.count({
      where: { orgId, createdAt: { gte: monthStart }, deletedAt: null },
    });
    if (count >= limits.postsPerMonth) {
      throw new ForbiddenException(
        `Monthly post limit (${limits.postsPerMonth}) reached. Upgrade your plan.`,
      );
    }
  }
}
