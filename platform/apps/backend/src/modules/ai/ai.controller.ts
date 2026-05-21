import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrgMemberGuard } from '../../common/guards/org-member.guard';
import { GenerateContentDto, GenerateImageDto, ImproveContentDto } from '@loraloop/shared';

@Controller('organizations/:orgId/ai')
@UseGuards(JwtAuthGuard, OrgMemberGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-content')
  generateContent(@Param('orgId') orgId: string, @Body() dto: GenerateContentDto) {
    return this.aiService.generateContent(orgId, dto);
  }

  @Post('generate-image')
  generateImage(@Param('orgId') orgId: string, @Body() dto: GenerateImageDto) {
    return this.aiService.generateImage(orgId, dto);
  }

  @Post('improve-content')
  improveContent(@Param('orgId') orgId: string, @Body() dto: ImproveContentDto) {
    return this.aiService.improveContent(orgId, dto);
  }
}
