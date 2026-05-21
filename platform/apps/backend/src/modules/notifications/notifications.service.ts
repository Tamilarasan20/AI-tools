import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@loraloop/database';

@Injectable()
export class NotificationsService {
  private readonly prisma = new PrismaClient();

  async list(userId: string, orgId?: string) {
    return this.prisma.notification.findMany({
      where: { userId, ...(orgId && { orgId }) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(userId: string, notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async create(data: {
    userId: string;
    orgId?: string;
    type: any;
    title: string;
    message: string;
    link?: string;
    metadata?: any;
  }) {
    return this.prisma.notification.create({ data });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, read: false } });
  }
}
