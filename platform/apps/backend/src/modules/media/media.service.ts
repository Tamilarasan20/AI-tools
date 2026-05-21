import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@loraloop/database';
import { MediaQueryDto, MediaType, PLAN_LIMITS } from '@loraloop/shared';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private readonly prisma = new PrismaClient();
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = config.get<string>('storage.r2.bucket') || 'loraloop-media';
    this.publicUrl = config.get<string>('storage.r2.publicUrl') || '';
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: config.get<string>('storage.r2.endpoint'),
      credentials: {
        accessKeyId: config.get<string>('storage.r2.accessKey') || '',
        secretAccessKey: config.get<string>('storage.r2.secretKey') || '',
      },
    });
  }

  async upload(orgId: string, file: Express.Multer.File, alt?: string) {
    await this.checkStorageLimit(orgId);

    const ext = file.originalname.split('.').pop();
    const key = `${orgId}/${uuidv4()}.${ext}`;
    const type = this.detectType(file.mimetype);

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }));

    const url = `${this.publicUrl}/${key}`;

    return this.prisma.media.create({
      data: {
        orgId, name: file.originalname, url, key,
        type, mimeType: file.mimetype, size: file.size,
        alt: alt || null,
      },
    });
  }

  async getPresignedUrl(orgId: string, filename: string, contentType: string) {
    const ext = filename.split('.').pop();
    const key = `${orgId}/${uuidv4()}.${ext}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    const publicUrl = `${this.publicUrl}/${key}`;
    return { uploadUrl, publicUrl, key };
  }

  async list(orgId: string, query: MediaQueryDto) {
    const { type, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where: any = { orgId, deletedAt: null };
    if (type) where.type = type;

    const [data, total] = await Promise.all([
      this.prisma.media.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.media.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async delete(orgId: string, mediaId: string) {
    const media = await this.prisma.media.findFirst({ where: { id: mediaId, orgId, deletedAt: null } });
    if (!media) throw new NotFoundException('Media not found');

    try {
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: media.key }));
    } catch { /* ignore S3 errors on delete */ }

    await this.prisma.media.update({ where: { id: mediaId }, data: { deletedAt: new Date() } });
  }

  private detectType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/gif')) return 'GIF';
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    return 'DOCUMENT';
  }

  private async checkStorageLimit(orgId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { orgId } });
    const plan = sub?.plan || 'FREE';
    const limits = PLAN_LIMITS[plan];
    if (limits.mediaStorageGb === -1) return;

    const result = await this.prisma.media.aggregate({
      where: { orgId, deletedAt: null },
      _sum: { size: true },
    });
    const usedBytes = result._sum.size || 0;
    const limitBytes = limits.mediaStorageGb * 1024 * 1024 * 1024;
    if (usedBytes >= limitBytes) {
      throw new ForbiddenException(`Storage limit (${limits.mediaStorageGb}GB) reached. Upgrade your plan.`);
    }
  }
}
