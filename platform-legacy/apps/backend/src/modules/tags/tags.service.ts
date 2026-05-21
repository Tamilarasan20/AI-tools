import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@loraloop/database';
import { CreateTagDto } from '@loraloop/shared';

@Injectable()
export class TagsService {
  private readonly prisma = new PrismaClient();

  async create(orgId: string, dto: CreateTagDto) {
    const existing = await this.prisma.tag.findUnique({ where: { orgId_name: { orgId, name: dto.name } } });
    if (existing) throw new ConflictException('Tag name already exists');
    return this.prisma.tag.create({ data: { orgId, name: dto.name, color: dto.color || '#6366f1' } });
  }

  async list(orgId: string) {
    return this.prisma.tag.findMany({
      where: { orgId },
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async delete(orgId: string, id: string) {
    const tag = await this.prisma.tag.findFirst({ where: { id, orgId } });
    if (!tag) throw new NotFoundException('Tag not found');
    await this.prisma.tag.delete({ where: { id } });
  }
}
