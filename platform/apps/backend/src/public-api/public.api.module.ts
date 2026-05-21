import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from '@loraloop/backend/services/auth/auth.service';
import { StripeService } from '@loraloop/nestjs-libraries/services/stripe.service';
import { PoliciesGuard } from '@loraloop/backend/services/auth/permissions/permissions.guard';
import { PermissionsService } from '@loraloop/backend/services/auth/permissions/permissions.service';
import { IntegrationManager } from '@loraloop/nestjs-libraries/integrations/integration.manager';
import { UploadModule } from '@loraloop/nestjs-libraries/upload/upload.module';
import { OpenaiService } from '@loraloop/nestjs-libraries/openai/openai.service';
import { ExtractContentService } from '@loraloop/nestjs-libraries/openai/extract.content.service';
import { CodesService } from '@loraloop/nestjs-libraries/services/codes.service';
import { PublicIntegrationsController } from '@loraloop/backend/public-api/routes/v1/public.integrations.controller';
import { PublicAuthMiddleware } from '@loraloop/backend/services/auth/public.auth.middleware';

const authenticatedController = [PublicIntegrationsController];
@Module({
  imports: [UploadModule],
  controllers: [...authenticatedController],
  providers: [
    AuthService,
    StripeService,
    OpenaiService,
    ExtractContentService,
    PoliciesGuard,
    PermissionsService,
    CodesService,
    IntegrationManager,
  ],
  get exports() {
    return [...this.imports, ...this.providers];
  },
})
export class PublicApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PublicAuthMiddleware).forRoutes(...authenticatedController);
  }
}

