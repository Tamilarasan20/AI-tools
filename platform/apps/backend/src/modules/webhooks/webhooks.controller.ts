import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { CreateWebhookDto, UpdateWebhookDto } from '@loraloop/shared';

@Controller('organizations/:orgId/webhooks')
@UseGuards(JwtAuthGuard, OrgMemberGuard)
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  create(@Param('orgId') orgId: string, @Body() dto: CreateWebhookDto) {
    return this.webhooksService.create(orgId, dto);
  }

  @Get()
  list(@Param('orgId') orgId: string) {
    return this.webhooksService.list(orgId);
  }

  @Patch(':id')
  update(@Param('orgId') orgId: string, @Param('id') id: string, @Body() dto: UpdateWebhookDto) {
    return this.webhooksService.update(orgId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.webhooksService.delete(orgId, id);
  }
}
