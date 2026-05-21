import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@loraloop/database';
import { CreateCheckoutDto, SubscriptionPlan, BillingPeriod } from '@loraloop/shared';
import Stripe from 'stripe';

const PRICE_IDS: Record<SubscriptionPlan, Record<BillingPeriod, string | null>> = {
  FREE: { MONTHLY: null, ANNUAL: null, LIFETIME: null },
  STARTER: {
    MONTHLY: process.env.STRIPE_STARTER_MONTHLY || '',
    ANNUAL: process.env.STRIPE_STARTER_ANNUAL || '',
    LIFETIME: process.env.STRIPE_STARTER_LIFETIME || '',
  },
  PRO: {
    MONTHLY: process.env.STRIPE_PRO_MONTHLY || '',
    ANNUAL: process.env.STRIPE_PRO_ANNUAL || '',
    LIFETIME: process.env.STRIPE_PRO_LIFETIME || '',
  },
  BUSINESS: {
    MONTHLY: process.env.STRIPE_BUSINESS_MONTHLY || '',
    ANNUAL: process.env.STRIPE_BUSINESS_ANNUAL || '',
    LIFETIME: process.env.STRIPE_BUSINESS_LIFETIME || '',
  },
  ENTERPRISE: { MONTHLY: null, ANNUAL: null, LIFETIME: null },
};

@Injectable()
export class BillingService {
  private readonly prisma = new PrismaClient();
  private readonly stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(config.get<string>('stripe.secretKey') || '', {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createCheckout(orgId: string, userId: string, dto: CreateCheckoutDto) {
    const priceId = PRICE_IDS[dto.plan]?.[dto.period];
    if (!priceId) throw new BadRequestException('Invalid plan or billing period');

    let sub = await this.prisma.subscription.findUnique({ where: { orgId } });
    let customerId = sub?.stripeCustomerId;

    if (!customerId) {
      const org = await this.prisma.organization.findUnique({ where: { id: orgId } });
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const customer = await this.stripe.customers.create({
        email: user?.email,
        name: org?.name,
        metadata: { orgId },
      });
      customerId = customer.id;
      await this.prisma.subscription.update({
        where: { orgId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: dto.period === 'LIFETIME' ? 'payment' : 'subscription',
      success_url: `${this.config.get('app.frontendUrl')}/settings/billing?success=true`,
      cancel_url: `${this.config.get('app.frontendUrl')}/settings/billing?canceled=true`,
      metadata: { orgId, plan: dto.plan, period: dto.period },
    });

    return { url: session.url };
  }

  async createPortal(orgId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { orgId } });
    if (!sub?.stripeCustomerId) throw new NotFoundException('No billing information found');

    const session = await this.stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${this.config.get('app.frontendUrl')}/settings/billing`,
    });
    return { url: session.url };
  }

  async getSubscription(orgId: string) {
    return this.prisma.subscription.findUnique({ where: { orgId } });
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.config.get<string>('stripe.webhookSecret');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret!);
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { orgId, plan, period } = session.metadata || {};
        if (!orgId || !plan) break;

        await this.prisma.subscription.update({
          where: { orgId },
          data: {
            plan: plan as SubscriptionPlan,
            period: period as BillingPeriod,
            stripeCustomerId: session.customer as string,
            stripeSubId: session.subscription as string || null,
            isLifetime: period === 'LIFETIME',
          },
        });
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customer = await this.stripe.customers.retrieve(sub.customer as string);
        const orgId = (customer as Stripe.Customer).metadata?.orgId;
        if (!orgId) break;

        await this.prisma.subscription.update({
          where: { orgId },
          data: {
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customer = await this.stripe.customers.retrieve(sub.customer as string);
        const orgId = (customer as Stripe.Customer).metadata?.orgId;
        if (!orgId) break;

        await this.prisma.subscription.update({
          where: { orgId },
          data: { plan: 'FREE', stripeSubId: null, currentPeriodEnd: null },
        });
        break;
      }
    }
  }
}
