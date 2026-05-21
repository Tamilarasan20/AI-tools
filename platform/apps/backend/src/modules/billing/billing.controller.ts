import {
  Controller, Post, Get, Body, Param, Req, UseGuards, Headers, HttpCode, HttpStatus, RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCheckoutDto } from '@loraloop/shared';

@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('organizations/:orgId/billing/checkout')
  @UseGuards(JwtAuthGuard, OrgMemberGuard)
  checkout(
    @Param('orgId') orgId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.billingService.createCheckout(orgId, userId, dto);
  }

  @Post('organizations/:orgId/billing/portal')
  @UseGuards(JwtAuthGuard, OrgMemberGuard)
  portal(@Param('orgId') orgId: string) {
    return this.billingService.createPortal(orgId);
  }

  @Get('organizations/:orgId/billing/subscription')
  @UseGuards(JwtAuthGuard, OrgMemberGuard)
  getSubscription(@Param('orgId') orgId: string) {
    return this.billingService.getSubscription(orgId);
  }

  @Post('billing/webhook')
  @HttpCode(HttpStatus.OK)
  webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.billingService.handleWebhook(req.rawBody!, signature);
  }
}
