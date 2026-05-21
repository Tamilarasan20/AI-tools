import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullMQModule } from '@nestjs/bullmq';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PostsModule } from './modules/posts/posts.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { MediaModule } from './modules/media/media.module';
import { AiModule } from './modules/ai/ai.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BillingModule } from './modules/billing/billing.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { TagsModule } from './modules/tags/tags.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { QueueModule } from './modules/queue/queue.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    BullMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('redis.url') || 'redis://localhost:6379';
        const url = new URL(redisUrl);
        return {
          connection: {
            host: url.hostname,
            port: parseInt(url.port) || 6379,
            password: url.password || undefined,
          },
        };
      },
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    PostsModule,
    IntegrationsModule,
    MediaModule,
    AiModule,
    AnalyticsModule,
    BillingModule,
    NotificationsModule,
    WebhooksModule,
    TagsModule,
    ApiKeysModule,
    QueueModule,
    HealthModule,
  ],
})
export class AppModule {}
