import { Controller, Get, Post, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { CreateTagDto } from '@loraloop/shared';

@Controller('organizations/:orgId/tags')
@UseGuards(JwtAuthGuard, OrgMemberGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Param('orgId') orgId: string, @Body() dto: CreateTagDto) {
    return this.tagsService.create(orgId, dto);
  }

  @Get()
  list(@Param('orgId') orgId: string) {
    return this.tagsService.list(orgId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.tagsService.delete(orgId, id);
  }
}
