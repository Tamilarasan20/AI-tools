import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { CreatePostDto, UpdatePostDto, SchedulePostDto, PostsQueryDto } from '@loraloop/shared';

@Controller('organizations/:orgId/posts')
@UseGuards(JwtAuthGuard, OrgMemberGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Param('orgId') orgId: string, @Body() dto: CreatePostDto) {
    return this.postsService.create(orgId, dto);
  }

  @Get()
  list(@Param('orgId') orgId: string, @Query() query: PostsQueryDto) {
    return this.postsService.list(orgId, query);
  }

  @Get(':id')
  getOne(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.postsService.getOne(orgId, id);
  }

  @Patch(':id')
  update(@Param('orgId') orgId: string, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(orgId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.postsService.delete(orgId, id);
  }

  @Post(':id/schedule')
  schedule(@Param('orgId') orgId: string, @Param('id') id: string, @Body() dto: SchedulePostDto) {
    return this.postsService.schedule(orgId, id, dto);
  }

  @Post(':id/publish-now')
  publishNow(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.postsService.publishNow(orgId, id);
  }

  @Post(':id/cancel')
  cancel(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.postsService.cancel(orgId, id);
  }
}
