import { Module } from '@nestjs/common';
import { BullMQModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';

@Module({
  imports: [BullMQModule.registerQueue({ name: 'post-publishing' })],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
