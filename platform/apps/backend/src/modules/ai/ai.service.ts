import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@loraloop/database';
import {
  GenerateContentDto, GenerateImageDto, ImproveContentDto,
  PLAN_LIMITS, PLATFORM_CHAR_LIMITS,
} from '@loraloop/shared';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly prisma = new PrismaClient();
  private readonly openai: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.openai = new OpenAI({ apiKey: config.get<string>('openai.apiKey') });
  }

  async generateContent(orgId: string, dto: GenerateContentDto) {
    await this.checkAiCredits(orgId);

    const charLimit = dto.platform ? PLATFORM_CHAR_LIMITS[dto.platform] : 2000;
    const variations = dto.variations || 3;

    const systemPrompt = `You are a social media content expert. Generate ${variations} distinct post variations.
${dto.platform ? `Platform: ${dto.platform}. Character limit: ${charLimit} characters.` : ''}
${dto.tone ? `Tone: ${dto.tone}.` : ''}
Format each variation with "---" separator. Include relevant hashtags.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: dto.prompt },
      ],
      max_tokens: 1500,
    });

    await this.trackUsage(orgId, 'text', response.usage?.total_tokens);

    const content = response.choices[0].message.content || '';
    const variations_list = content.split('---').map((v) => v.trim()).filter(Boolean);
    return { variations: variations_list, tokensUsed: response.usage?.total_tokens };
  }

  async generateImage(orgId: string, dto: GenerateImageDto) {
    await this.checkAiCredits(orgId, 5);

    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: dto.prompt,
      size: (dto.size as any) || '1024x1024',
      quality: (dto.quality as any) || 'standard',
      n: 1,
    });

    await this.trackUsage(orgId, 'image', undefined, 5);

    return { url: response.data[0].url, revisedPrompt: response.data[0].revised_prompt };
  }

  async improveContent(orgId: string, dto: ImproveContentDto) {
    await this.checkAiCredits(orgId);

    const charLimit = dto.platform ? PLATFORM_CHAR_LIMITS[dto.platform] : null;
    const systemPrompt = `You are a social media content expert. Improve the given content.
${dto.platform ? `Optimize for ${dto.platform}.${charLimit ? ` Stay under ${charLimit} characters.` : ''}` : ''}
${dto.instruction ? `Specific instruction: ${dto.instruction}` : 'Make it more engaging and impactful.'}
Return only the improved content, no explanations.`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: dto.content },
      ],
      max_tokens: 800,
    });

    await this.trackUsage(orgId, 'text', response.usage?.total_tokens);

    return {
      improved: response.choices[0].message.content?.trim(),
      tokensUsed: response.usage?.total_tokens,
    };
  }

  private async checkAiCredits(orgId: string, cost = 1) {
    const sub = await this.prisma.subscription.findUnique({ where: { orgId } });
    const plan = sub?.plan || 'FREE';
    const limits = PLAN_LIMITS[plan];
    if (limits.aiCreditsPerMonth === -1) return;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const result = await this.prisma.aiUsage.aggregate({
      where: { orgId, createdAt: { gte: monthStart } },
      _sum: { credits: true },
    });
    const used = result._sum.credits || 0;
    if (used + cost > limits.aiCreditsPerMonth) {
      throw new ForbiddenException(`AI credits exhausted (${limits.aiCreditsPerMonth}/mo). Upgrade your plan.`);
    }
  }

  private async trackUsage(orgId: string, type: string, tokens?: number, credits = 1) {
    await this.prisma.aiUsage.create({
      data: { orgId, type, tokens: tokens || null, credits, model: 'gpt-4o' },
    });
  }
}
