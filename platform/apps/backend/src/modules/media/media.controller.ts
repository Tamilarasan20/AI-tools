import {
  Controller, Get, Post, Delete, Body, Param, Query, UseGuards,
  UseInterceptors, UploadedFile, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { MediaQueryDto } from '@loraloop/shared';

@Controller('organizations/:orgId/media')
@UseGuards(JwtAuthGuard, OrgMemberGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('orgId') orgId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('alt') alt?: string,
  ) {
    return this.mediaService.upload(orgId, file, alt);
  }

  @Get('presigned-url')
  getPresignedUrl(
    @Param('orgId') orgId: string,
    @Query('filename') filename: string,
    @Query('contentType') contentType: string,
  ) {
    return this.mediaService.getPresignedUrl(orgId, filename, contentType);
  }

  @Get()
  list(@Param('orgId') orgId: string, @Query() query: MediaQueryDto) {
    return this.mediaService.list(orgId, query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('orgId') orgId: string, @Param('id') id: string) {
    return this.mediaService.delete(orgId, id);
  }
}
