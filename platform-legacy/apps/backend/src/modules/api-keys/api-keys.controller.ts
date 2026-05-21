import { Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { CreateApiKeyDto } from '@loraloop/shared';

@Controller('organizations/:orgId/api-keys')
@UseGuards(JwtAuthGuard, OrgMemberGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(@Param('orgId') orgId: string, @Body() dto: CreateApiKeyDto) {
    return this.apiKeysService.create(orgId, dto);
  }

  @Get()
  list(@Param('orgId') orgId: string) {
    return this.apiKeysService.list(orgId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.apiKeysService.delete(orgId, id);
  }
}
