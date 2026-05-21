import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { AnalyticsQueryDto } from '@loraloop/shared';

@Controller('organizations/:orgId/analytics')
@UseGuards(JwtAuthGuard, OrgMemberGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  get(@Param('orgId') orgId: string, @Query() query: AnalyticsQueryDto) {
    return this.analyticsService.get(orgId, query);
  }

  @Get('overview')
  overview(@Param('orgId') orgId: string) {
    return this.analyticsService.overview(orgId);
  }
}
