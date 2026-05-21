import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from '@loraloop/backend/api/routes/auth.controller';
import { AuthService } from '@loraloop/backend/services/auth/auth.service';
import { UsersController } from '@loraloop/backend/api/routes/users.controller';
import { AuthMiddleware } from '@loraloop/backend/services/auth/auth.middleware';
import { StripeController } from '@loraloop/backend/api/routes/stripe.controller';
import { StripeService } from '@loraloop/nestjs-libraries/services/stripe.service';
import { AnalyticsController } from '@loraloop/backend/api/routes/analytics.controller';
import { PoliciesGuard } from '@loraloop/backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@loraloop/backend/services/auth/permissions/permissions.service';
import { IntegrationsController } from '@loraloop/backend/api/routes/integrations.controller';
import { IntegrationManager } from '@loraloop/nestjs-libraries/integrations/integration.manager';
import { SettingsController } from '@loraloop/backend/api/routes/settings.controller';
import { PostsController } from '@loraloop/backend/api/routes/posts.controller';
import { MediaController } from '@loraloop/backend/api/routes/media.controller';
import { UploadModule } from '@loraloop/nestjs-libraries/upload/upload.module';
import { BillingController } from '@loraloop/backend/api/routes/billing.controller';
import { NotificationsController } from '@loraloop/backend/api/routes/notifications.controller';
import { OpenaiService } from '@loraloop/nestjs-libraries/openai/openai.service';
import { ExtractContentService } from '@loraloop/nestjs-libraries/openai/extract.content.service';
import { CodesService } from '@loraloop/nestjs-libraries/services/codes.service';
import { CopilotController } from '@loraloop/backend/api/routes/copilot.controller';
import { PublicController } from '@loraloop/backend/api/routes/public.controller';
import { RootController } from '@loraloop/backend/api/routes/root.controller';
import { TrackService } from '@loraloop/nestjs-libraries/track/track.service';
import { ShortLinkService } from '@loraloop/nestjs-libraries/short-linking/short.link.service';
import { Nowpayments } from '@loraloop/nestjs-libraries/crypto/nowpayments';
import { WebhookController } from '@loraloop/backend/api/routes/webhooks.controller';
import { SignatureController } from '@loraloop/backend/api/routes/signature.controller';
import { AutopostController } from '@loraloop/backend/api/routes/autopost.controller';
import { SetsController } from '@loraloop/backend/api/routes/sets.controller';
import { ThirdPartyController } from '@loraloop/backend/api/routes/third-party.controller';
import { MonitorController } from '@loraloop/backend/api/routes/monitor.controller';
import { NoAuthIntegrationsController } from '@loraloop/backend/api/routes/no.auth.integrations.controller';
import { EnterpriseController } from '@loraloop/backend/api/routes/enterprise.controller';
import { OAuthAppController } from '@loraloop/backend/api/routes/oauth-app.controller';
import { ApprovedAppsController } from '@loraloop/backend/api/routes/approved-apps.controller';
import { OAuthController, OAuthAuthorizedController } from '@loraloop/backend/api/routes/oauth.controller';
import { AnnouncementsController } from '@loraloop/backend/api/routes/announcements.controller';
import { AdminController } from '@loraloop/backend/api/routes/admin.controller';
import { AuthProviderManager } from '@loraloop/backend/services/auth/providers/providers.manager';
import { GithubProvider } from '@loraloop/backend/services/auth/providers/github.provider';
import { GoogleProvider } from '@loraloop/backend/services/auth/providers/google.provider';
import { FarcasterProvider } from '@loraloop/backend/services/auth/providers/farcaster.provider';
import { WalletProvider } from '@loraloop/backend/services/auth/providers/wallet.provider';
import { OauthProvider } from '@loraloop/backend/services/auth/providers/oauth.provider';

const authenticatedController = [
  UsersController,
  AnalyticsController,
  IntegrationsController,
  SettingsController,
  PostsController,
  MediaController,
  BillingController,
  NotificationsController,
  CopilotController,
  WebhookController,
  SignatureController,
  AutopostController,
  SetsController,
  ThirdPartyController,
  OAuthAppController,
  ApprovedAppsController,
  OAuthAuthorizedController,
  AnnouncementsController,
  AdminController,
];
@Module({
  imports: [UploadModule],
  controllers: [
    RootController,
    StripeController,
    AuthController,
    PublicController,
    MonitorController,
    EnterpriseController,
    NoAuthIntegrationsController,
    OAuthController,
    ...authenticatedController,
  ],
  providers: [
    AuthService,
    StripeService,
    OpenaiService,
    ExtractContentService,
    AuthMiddleware,
    PoliciesGuard,
    PermissionsService,
    CodesService,
    IntegrationManager,
    TrackService,
    ShortLinkService,
    Nowpayments,
    AuthProviderManager,
    GithubProvider,
    GoogleProvider,
    FarcasterProvider,
    WalletProvider,
    OauthProvider,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(...authenticatedController);
  }
}
