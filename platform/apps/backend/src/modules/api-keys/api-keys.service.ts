import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@loraloop/database';
import { CreateApiKeyDto } from '@loraloop/shared';
import { createHash, randomBytes } from 'crypto';

@Injectable()
export class ApiKeysService {
  private readonly prisma = new PrismaClient();

  async create(orgId: string, dto: CreateApiKeyDto) {
    const rawKey = `lrl_${randomBytes(32).toString('hex')}`;
    const keyPrefix = rawKey.slice(0, 12);
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await this.prisma.apiKey.create({
      data: {
        orgId,
        name: dto.name,
        keyHash,
        keyPrefix,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    return { ...apiKey, key: rawKey };
  }

  async list(orgId: string) {
    return this.prisma.apiKey.findMany({
      where: { orgId, deletedAt: null },
      select: { id: true, name: true, keyPrefix: true, lastUsed: true, expiresAt: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(orgId: string, id: string) {
    const key = await this.prisma.apiKey.findFirst({ where: { id, orgId, deletedAt: null } });
    if (!key) throw new NotFoundException('API key not found');
    await this.prisma.apiKey.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async validateKey(rawKey: string) {
    const keyHash = createHash('sha256').update(rawKey).digest('hex');
    const key = await this.prisma.apiKey.findFirst({
      where: { keyHash, deletedAt: null },
      include: { org: { include: { members: true, subscription: true } } },
    });
    if (!key) return null;
    if (key.expiresAt && key.expiresAt < new Date()) return null;
    await this.prisma.apiKey.update({ where: { id: key.id }, data: { lastUsed: new Date() } });
    return key;
  }
}
