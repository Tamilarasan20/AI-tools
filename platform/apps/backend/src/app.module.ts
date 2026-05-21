import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '@loraloop/nestjs-libraries/database/prisma/database.module';
import { ApiModule } from '@loraloop/backend/api/api.module';
import { APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from '@loraloop/backend/services/auth/permissions/permissions.guard';
import { PublicApiModule } from '@loraloop/backend/public-api/public.api.module';
import { ThrottlerBehindProxyGuard } from '@loraloop/nestjs-libraries/throttler/throttler.provider';
import { ThrottlerModule } from '@nestjs/throttler';
import { AgentModule } from '@loraloop/nestjs-libraries/agent/agent.module';
import { ThirdPartyModule } from '@loraloop/nestjs-libraries/3rdparties/thirdparty.module';
import { VideoModule } from '@loraloop/nestjs-libraries/videos/video.module';
import { SentryModule } from '@sentry/nestjs/setup';
import { FILTER } from '@loraloop/nestjs-libraries/sentry/sentry.exception';
import { ChatModule } from '@loraloop/nestjs-libraries/chat/chat.module';
import { getTemporalModule } from '@loraloop/nestjs-libraries/temporal/temporal.module';
import { TemporalRegisterMissingSearchAttributesModule } from '@loraloop/nestjs-libraries/temporal/temporal.register';
import { InfiniteWorkflowRegisterModule } from '@loraloop/nestjs-libraries/temporal/infinite.workflow.register';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ioRedis } from '@loraloop/nestjs-libraries/redis/redis.service';

@Global()
@Module({
  imports: [
    SentryModule.forRoot(),
    DatabaseModule,
    ApiModule,
    PublicApiModule,
    AgentModule,
    ThirdPartyModule,
    VideoModule,
    ChatModule,
    getTemporalModule(false),
    TemporalRegisterMissingSearchAttributesModule,
    InfiniteWorkflowRegisterModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 3600000,
          limit: process.env.API_LIMIT ? Number(process.env.API_LIMIT) : 90,
        },
      ],
      storage: new ThrottlerStorageRedisService(ioRedis),
    }),
  ],
  controllers: [],
  providers: [
    FILTER,
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PoliciesGuard,
    },
  ],
  exports: [
    DatabaseModule,
    ApiModule,
    PublicApiModule,
    AgentModule,
    ThrottlerModule,
    ChatModule,
  ],
})
export class AppModule {}
