import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, JobCounts } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('post-publishing') private readonly publishQueue: Queue) {}

  async getJobCounts(): Promise<JobCounts> {
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
