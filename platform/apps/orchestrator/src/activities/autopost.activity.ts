import { Injectable } from '@nestjs/common';
import { Activity, ActivityMethod } from 'nestjs-temporal-core';
import { PostsService } from '@loraloop/nestjs-libraries/database/prisma/posts/posts.service';
import {
  NotificationService,
  NotificationType,
} from '@loraloop/nestjs-libraries/database/prisma/notifications/notification.service';
import { Integration, Post, State } from '@prisma/client';
import { stripHtmlValidation } from '@loraloop/helpers/utils/strip.html.validation';
import { IntegrationManager } from '@loraloop/nestjs-libraries/integrations/integration.manager';
import { AuthTokenDetails } from '@loraloop/nestjs-libraries/integrations/social/social.integrations.interface';
import { RefreshIntegrationService } from '@loraloop/nestjs-libraries/integrations/refresh.integration.service';
import { timer } from '@loraloop/helpers/utils/timer';
import { IntegrationService } from '@loraloop/nestjs-libraries/database/prisma/integrations/integration.service';
import { WebhooksService } from '@loraloop/nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { AutopostService } from '@loraloop/nestjs-libraries/database/prisma/autopost/autopost.service';

@Injectable()
@Activity()
export class AutopostActivity {
  constructor(private _autoPostService: AutopostService) {}

  @ActivityMethod()
  async autoPost(id: string) {
    return this._autoPostService.startAutopost(id)
  }
}
