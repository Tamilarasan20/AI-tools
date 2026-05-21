import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('post-publishing') private readonly publishQueue: Queue) {}

  async getJobCounts() {
    return this.publishQueue.getJobCounts();
  }

  async addJob(name: string, data: any, opts?: any) {
    return this.publishQueue.add(name, data, opts);
  }

  async removeJob(jobId: string) {
    const job = await this.publishQueue.getJob(jobId);
    if (job) await job.remove();
  }
}
