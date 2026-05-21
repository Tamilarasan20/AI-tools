import {
  Controller, Get, Patch, Delete, Post, Body, Param, Query, UseGuards, Redirect, HttpCode, HttpStatus,
} from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Platform, UpdateIntegrationDto } from '@loraloop/shared';

@Controller()
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('organizations/:orgId/integrations')
  @UseGuards(OrgMemberGuard)
  list(@Param('orgId') orgId: string) {
    return this.integrationsService.list(orgId);
  }

  @Get('oauth/:platform/connect')
  @UseGuards(OrgMemberGuard)
  async getOAuthUrl(
    @Param('platform') platform: Platform,
    @Query('orgId') orgId: string,
    @CurrentUser('userId') userId: string,
  ) {
    const url = await this.integrationsService.getOAuthUrl(platform, orgId, userId);
    return { url };
  }

  @Get('oauth/:platform/callback')
  @Redirect()
  async handleCallback(
    @Param('platform') platform: Platform,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const redirectUrl = await this.integrationsService.handleCallback(platform, code, state);
    return { url: redirectUrl };
  }

  @Patch('organizations/:orgId/integrations/:id')
  @UseGuards(OrgMemberGuard)
  update(
    @Param('orgId') orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateIntegrationDto,
  ) {
    return this.integrationsService.update(orgId, id, dto);
  }

  @Delete('organizations/:orgId/integrations/:id')
  @UseGuards(OrgMemberGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  disconnect(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.integrationsService.disconnect(orgId, id);
  }
}
