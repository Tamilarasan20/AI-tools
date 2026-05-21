import { Global, Module } from '@nestjs/common';
import { PrismaRepository, PrismaService, PrismaTransaction } from './prisma.service';
import { OrganizationRepository } from '@loraloop/nestjs-libraries/database/prisma/organizations/organization.repository';
import { OrganizationService } from '@loraloop/nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@loraloop/nestjs-libraries/database/prisma/users/users.service';
import { UsersRepository } from '@loraloop/nestjs-libraries/database/prisma/users/users.repository';
import { SubscriptionService } from '@loraloop/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { SubscriptionRepository } from '@loraloop/nestjs-libraries/database/prisma/subscriptions/subscription.repository';
import { NotificationService } from '@loraloop/nestjs-libraries/database/prisma/notifications/notification.service';
import { IntegrationService } from '@loraloop/nestjs-libraries/database/prisma/integrations/integration.service';
import { IntegrationRepository } from '@loraloop/nestjs-libraries/database/prisma/integrations/integration.repository';
import { PostsService } from '@loraloop/nestjs-libraries/database/prisma/posts/posts.service';
import { PostsRepository } from '@loraloop/nestjs-libraries/database/prisma/posts/posts.repository';
import { IntegrationManager } from '@loraloop/nestjs-libraries/integrations/integration.manager';
import { MediaService } from '@loraloop/nestjs-libraries/database/prisma/media/media.service';
import { MediaRepository } from '@loraloop/nestjs-libraries/database/prisma/media/media.repository';
import { NotificationsRepository } from '@loraloop/nestjs-libraries/database/prisma/notifications/notifications.repository';
import { EmailService } from '@loraloop/nestjs-libraries/services/email.service';
import { StripeService } from '@loraloop/nestjs-libraries/services/stripe.service';
import { ExtractContentService } from '@loraloop/nestjs-libraries/openai/extract.content.service';
import { OpenaiService } from '@loraloop/nestjs-libraries/openai/openai.service';
import { AgenciesService } from '@loraloop/nestjs-libraries/database/prisma/agencies/agencies.service';
import { AgenciesRepository } from '@loraloop/nestjs-libraries/database/prisma/agencies/agencies.repository';
import { TrackService } from '@loraloop/nestjs-libraries/track/track.service';
import { ShortLinkService } from '@loraloop/nestjs-libraries/short-linking/short.link.service';
import { WebhooksRepository } from '@loraloop/nestjs-libraries/database/prisma/webhooks/webhooks.repository';
import { WebhooksService } from '@loraloop/nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { SignatureRepository } from '@loraloop/nestjs-libraries/database/prisma/signatures/signature.repository';
import { SignatureService } from '@loraloop/nestjs-libraries/database/prisma/signatures/signature.service';
import { AutopostRepository } from '@loraloop/nestjs-libraries/database/prisma/autopost/autopost.repository';
import { AutopostService } from '@loraloop/nestjs-libraries/database/prisma/autopost/autopost.service';
import { SetsService } from '@loraloop/nestjs-libraries/database/prisma/sets/sets.service';
import { SetsRepository } from '@loraloop/nestjs-libraries/database/prisma/sets/sets.repository';
import { ThirdPartyRepository } from '@loraloop/nestjs-libraries/database/prisma/third-party/third-party.repository';
import { ThirdPartyService } from '@loraloop/nestjs-libraries/database/prisma/third-party/third-party.service';
import { VideoManager } from '@loraloop/nestjs-libraries/videos/video.manager';
import { FalService } from '@loraloop/nestjs-libraries/openai/fal.service';
import { RefreshIntegrationService } from '@loraloop/nestjs-libraries/integrations/refresh.integration.service';
import { OAuthRepository } from '@loraloop/nestjs-libraries/database/prisma/oauth/oauth.repository';
import { OAuthService } from '@loraloop/nestjs-libraries/database/prisma/oauth/oauth.service';
import { AnnouncementsRepository } from '@loraloop/nestjs-libraries/database/prisma/announcements/announcements.repository';
import { AnnouncementsService } from '@loraloop/nestjs-libraries/database/prisma/announcements/announcements.service';
import { ErrorsRepository } from '@loraloop/nestjs-libraries/database/prisma/errors/errors.repository';
import { ErrorsService } from '@loraloop/nestjs-libraries/database/prisma/errors/errors.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    PrismaRepository,
    PrismaTransaction,
    UsersService,
    UsersRepository,
    OrganizationService,
    OrganizationRepository,
    SubscriptionService,
    SubscriptionRepository,
    NotificationService,
    NotificationsRepository,
    WebhooksRepository,
    WebhooksService,
    IntegrationService,
    IntegrationRepository,
    PostsService,
    PostsRepository,
    StripeService,
    SignatureRepository,
    AutopostRepository,
    AutopostService,
    SignatureService,
    MediaService,
    MediaRepository,
    AgenciesService,
    AgenciesRepository,
    IntegrationManager,
    RefreshIntegrationService,
    ExtractContentService,
    OpenaiService,
    FalService,
    EmailService,
    TrackService,
    ShortLinkService,
    SetsService,
    SetsRepository,
    ThirdPartyRepository,
    ThirdPartyService,
    OAuthRepository,
    OAuthService,
    VideoManager,
    AnnouncementsRepository,
    AnnouncementsService,
    ErrorsRepository,
    ErrorsService,
  ],
  get exports() {
    return this.providers;
  },
})
export class DatabaseModule {}
