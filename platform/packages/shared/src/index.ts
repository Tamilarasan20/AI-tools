// ─────────────────────────────────────────────────────────────────────────────
// LORALOOP SHARED TYPES & DTOS
// ─────────────────────────────────────────────────────────────────────────────

import {
  IsEmail, IsString, IsOptional, IsEnum, IsBoolean,
  IsArray, IsDateString, MinLength, MaxLength, IsUrl,
  IsInt, Min, Max, IsUUID,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

// ─────────── ENUMS (mirror Prisma) ───────────

export enum AuthProvider { LOCAL = 'LOCAL', GOOGLE = 'GOOGLE', GITHUB = 'GITHUB' }
export enum OrgRole { OWNER = 'OWNER', ADMIN = 'ADMIN', MEMBER = 'MEMBER' }
export enum SubscriptionPlan {
  FREE = 'FREE', STARTER = 'STARTER', PRO = 'PRO',
  BUSINESS = 'BUSINESS', ENTERPRISE = 'ENTERPRISE',
}
export enum BillingPeriod { MONTHLY = 'MONTHLY', ANNUAL = 'ANNUAL', LIFETIME = 'LIFETIME' }
export enum Platform {
  TWITTER = 'TWITTER',
  LINKEDIN_PERSONAL = 'LINKEDIN_PERSONAL',
  LINKEDIN_PAGE = 'LINKEDIN_PAGE',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE',
  REDDIT = 'REDDIT',
  PINTEREST = 'PINTEREST',
  DISCORD = 'DISCORD',
  SLACK = 'SLACK',
  BLUESKY = 'BLUESKY',
  MASTODON = 'MASTODON',
  THREADS = 'THREADS',
  TELEGRAM = 'TELEGRAM',
  GOOGLE_MY_BUSINESS = 'GOOGLE_MY_BUSINESS',
}
export enum PostState {
  DRAFT = 'DRAFT', SCHEDULED = 'SCHEDULED', PUBLISHING = 'PUBLISHING',
  PUBLISHED = 'PUBLISHED', FAILED = 'FAILED', CANCELED = 'CANCELED',
}
export enum MediaType { IMAGE = 'IMAGE', VIDEO = 'VIDEO', GIF = 'GIF', DOCUMENT = 'DOCUMENT' }

// ─────────── AUTH DTOs ───────────

export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(2) @MaxLength(60) name!: string;
  @IsString() @MinLength(8) @MaxLength(128) password!: string;
}

export class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

export class ForgotPasswordDto {
  @IsEmail() email!: string;
}

export class ResetPasswordDto {
  @IsString() token!: string;
  @IsString() @MinLength(8) @MaxLength(128) password!: string;
}

export class RefreshTokenDto {
  @IsString() refreshToken!: string;
}

export class ChangePasswordDto {
  @IsString() currentPassword!: string;
  @IsString() @MinLength(8) @MaxLength(128) newPassword!: string;
}

// ─────────── USER DTOs ───────────

export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(60) name?: string;
  @IsOptional() @IsString() timezone?: string;
  @IsOptional() @IsUrl() avatar?: string;
}

// ─────────── ORGANIZATION DTOs ───────────

export class CreateOrgDto {
  @IsString() @MinLength(2) @MaxLength(60) name!: string;
  @IsOptional() @IsString() @MaxLength(60) slug?: string;
  @IsOptional() @IsString() timezone?: string;
}

export class UpdateOrgDto {
  @IsOptional() @IsString() @MaxLength(60) name?: string;
  @IsOptional() @IsString() @MaxLength(60) slug?: string;
  @IsOptional() @IsUrl() logo?: string;
  @IsOptional() @IsUrl() website?: string;
  @IsOptional() @IsString() @MaxLength(300) description?: string;
  @IsOptional() @IsString() timezone?: string;
}

export class InviteMemberDto {
  @IsEmail() email!: string;
  @IsEnum(OrgRole) role!: OrgRole;
}

export class UpdateMemberRoleDto {
  @IsEnum(OrgRole) role!: OrgRole;
}

// ─────────── POST DTOs ───────────

export class CreatePostDto {
  @IsString() @MinLength(1) @MaxLength(50000) content!: string;
  @IsArray() integrationIds!: string[];
  @IsOptional() @IsDateString() publishAt?: string;
  @IsOptional() media?: PostMediaItem[];
  @IsOptional() settings?: Record<string, unknown>;
  @IsOptional() @IsArray() tagIds?: string[];
}

export class UpdatePostDto {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(50000) content?: string;
  @IsOptional() @IsArray() integrationIds?: string[];
  @IsOptional() @IsDateString() publishAt?: string;
  @IsOptional() media?: PostMediaItem[];
  @IsOptional() settings?: Record<string, unknown>;
  @IsOptional() @IsArray() tagIds?: string[];
}

export class SchedulePostDto {
  @IsDateString() publishAt!: string;
}

export class PostsQueryDto {
  @IsOptional() @IsEnum(PostState) state?: PostState;
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() to?: string;
  @IsOptional() @IsInt() @Min(1) page?: number;
  @IsOptional() @IsInt() @Min(1) @Max(100) limit?: number;
}

export interface PostMediaItem {
  id: string;
  url: string;
  type: MediaType;
  name?: string;
}

// ─────────── INTEGRATION DTOs ───────────

export class ConnectIntegrationDto {
  @IsEnum(Platform) platform!: Platform;
  @IsString() code!: string;
  @IsOptional() @IsString() state?: string;
}

export class UpdateIntegrationDto {
  @IsOptional() @IsBoolean() disabled?: boolean;
  @IsOptional() postingTimes?: Record<string, unknown>;
}

// ─────────── MEDIA DTOs ───────────

export class CreateMediaDto {
  @IsString() name!: string;
  @IsEnum(MediaType) type!: MediaType;
  @IsOptional() @IsString() alt?: string;
}

export class MediaQueryDto {
  @IsOptional() @IsEnum(MediaType) type?: MediaType;
  @IsOptional() @IsInt() @Min(1) page?: number;
  @IsOptional() @IsInt() @Min(1) @Max(100) limit?: number;
}

// ─────────── AI DTOs ───────────

export class GenerateContentDto {
  @IsString() @MinLength(10) prompt!: string;
  @IsOptional() @IsEnum(Platform) platform?: Platform;
  @IsOptional() @IsString() tone?: string;
  @IsOptional() @IsInt() @Min(1) @Max(10) variations?: number;
}

export class GenerateImageDto {
  @IsString() @MinLength(10) prompt!: string;
  @IsOptional() @IsString() size?: '1024x1024' | '1792x1024' | '1024x1792';
  @IsOptional() @IsString() quality?: 'standard' | 'hd';
}

export class ImproveContentDto {
  @IsString() content!: string;
  @IsOptional() @IsEnum(Platform) platform?: Platform;
  @IsOptional() @IsString() instruction?: string;
}

// ─────────── WEBHOOK DTOs ───────────

export class CreateWebhookDto {
  @IsUrl() url!: string;
  @IsArray() @IsString({ each: true }) events!: string[];
}

export class UpdateWebhookDto {
  @IsOptional() @IsUrl() url?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) events?: string[];
  @IsOptional() @IsBoolean() active?: boolean;
}

// ─────────── TAG DTOs ───────────

export class CreateTagDto {
  @IsString() @MinLength(1) @MaxLength(30) name!: string;
  @IsOptional() @IsString() color?: string;
}

// ─────────── API KEY DTOs ───────────

export class CreateApiKeyDto {
  @IsString() @MinLength(1) @MaxLength(60) name!: string;
  @IsOptional() @IsDateString() expiresAt?: string;
}

// ─────────── ANALYTICS DTOs ───────────

export class AnalyticsQueryDto {
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() to?: string;
  @IsOptional() @IsString() integrationId?: string;
}

// ─────────── SUBSCRIPTION DTOs ───────────

export class CreateCheckoutDto {
  @IsEnum(SubscriptionPlan) plan!: SubscriptionPlan;
  @IsEnum(BillingPeriod) period!: BillingPeriod;
}

// ─────────── CONSTANTS ───────────

export const PLAN_LIMITS: Record<SubscriptionPlan, {
  integrations: number;
  postsPerMonth: number;
  teamMembers: number;
  aiCreditsPerMonth: number;
  mediaStorageGb: number;
}> = {
  FREE: { integrations: 3, postsPerMonth: 30, teamMembers: 1, aiCreditsPerMonth: 10, mediaStorageGb: 1 },
  STARTER: { integrations: 7, postsPerMonth: 150, teamMembers: 3, aiCreditsPerMonth: 50, mediaStorageGb: 5 },
  PRO: { integrations: 20, postsPerMonth: 500, teamMembers: 10, aiCreditsPerMonth: 200, mediaStorageGb: 20 },
  BUSINESS: { integrations: 50, postsPerMonth: 2000, teamMembers: 25, aiCreditsPerMonth: 500, mediaStorageGb: 50 },
  ENTERPRISE: { integrations: -1, postsPerMonth: -1, teamMembers: -1, aiCreditsPerMonth: -1, mediaStorageGb: -1 },
};

export const PLATFORM_CHAR_LIMITS: Record<Platform, number> = {
  [Platform.TWITTER]: 280,
  [Platform.LINKEDIN_PERSONAL]: 3000,
  [Platform.LINKEDIN_PAGE]: 3000,
  [Platform.INSTAGRAM]: 2200,
  [Platform.FACEBOOK]: 63206,
  [Platform.TIKTOK]: 2200,
  [Platform.YOUTUBE]: 5000,
  [Platform.REDDIT]: 40000,
  [Platform.PINTEREST]: 500,
  [Platform.DISCORD]: 2000,
  [Platform.SLACK]: 3000,
  [Platform.BLUESKY]: 300,
  [Platform.MASTODON]: 500,
  [Platform.THREADS]: 500,
  [Platform.TELEGRAM]: 4096,
  [Platform.GOOGLE_MY_BUSINESS]: 1500,
};

export const WEBHOOK_EVENTS = [
  'post.created',
  'post.scheduled',
  'post.published',
  'post.failed',
  'post.canceled',
  'integration.connected',
  'integration.disconnected',
  'member.invited',
  'member.joined',
] as const;

export type WebhookEvent = typeof WEBHOOK_EVENTS[number];

// ─────────── RESPONSE TYPES ───────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
