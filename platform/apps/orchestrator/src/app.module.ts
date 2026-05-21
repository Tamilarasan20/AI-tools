import { Module } from '@nestjs/common';
import { PostActivity } from '@loraloop/orchestrator/activities/post.activity';
import { getTemporalModule } from '@loraloop/nestjs-libraries/temporal/temporal.module';
import { DatabaseModule } from '@loraloop/nestjs-libraries/database/prisma/database.module';
import { AutopostService } from '@loraloop/nestjs-libraries/database/prisma/autopost/autopost.service';
import { EmailActivity } from '@loraloop/orchestrator/activities/email.activity';
import { IntegrationsActivity } from '@loraloop/orchestrator/activities/integrations.activity';
import { HealthController } from '@loraloop/orchestrator/health.controller';

const activities = [
  PostActivity,
  AutopostService,
  EmailActivity,
  IntegrationsActivity,
];
@Module({
  imports: [
    DatabaseModule,
    getTemporalModule(true, require.resolve('./workflows'), activities),
  ],
  controllers: [HealthController],
  providers: [...activities],
  get exports() {
    return [...this.providers, ...this.imports];
  },
})
export class AppModule {}
