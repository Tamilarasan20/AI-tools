import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@loraloop/database';
import { CreateWebhookDto, UpdateWebhookDto } from '@loraloop/shared';
import { createHmac, randomBytes } from 'crypto';
import axios from 'axios';

@Injectable()
export class WebhooksService {
  private readonly prisma = new PrismaClient();

  async create(orgId: string, dto: CreateWebhookDto) {
    const secret = randomBytes(32).toString('hex');
    return this.prisma.webhook.create({
      data: { orgId, url: dto.url, events: dto.events, secret },
    });
  }

  async list(orgId: string) {
    return this.prisma.webhook.findMany({
      where: { orgId },
      select: { id: true, url: true, events: true, active: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(orgId: string, id: string, dto: UpdateWebhookDto) {
    await this.findOrFail(orgId, id);
    return this.prisma.webhook.update({ where: { id }, data: dto as any });
  }

  async delete(orgId: string, id: string) {
    await this.findOrFail(orgId, id);
    await this.prisma.webhook.delete({ where: { id } });
  }

  async deliver(orgId: string, event: string, payload: any) {
    const webhooks = await this.prisma.webhook.findMany({
      where: { orgId, active: true, events: { has: event } },
    });

    for (const webhook of webhooks) {
      const delivery = await this.prisma.webhookDelivery.create({
        data: { webhookId: webhook.id, event, payload },
      });

      const body = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
      const signature = createHmac('sha256', webhook.secret).update(body).digest('hex');

      let statusCode: number | undefined;
      let response: string | undefined;
      let success = false;

      try {
        const res = await axios.post(webhook.url, body, {
          headers: {
            'Content-Type': 'application/json',
            'X-Loraloop-Signature': `sha256=${signature}`,
            'X-Loraloop-Event': event,
          },
          timeout: 10000,
        });
        statusCode = res.status;
        success = res.status >= 200 && res.status < 300;
      } catch (err: any) {
        statusCode = err.response?.status;
        response = err.message;
      }

      await this.prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: { statusCode, response, success, attempts: 1 },
      });
    }
  }

  private async findOrFail(orgId: string, id: string) {
    const webhook = await this.prisma.webhook.findFirst({ where: { id, orgId } });
    if (!webhook) throw new NotFoundException('Webhook not found');
    return webhook;
  }
}
