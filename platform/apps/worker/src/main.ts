import 'dotenv/config';
import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { processPublishJob } from './job.processor';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const url = new URL(REDIS_URL);

const connection = new IORedis({
  host: url.hostname,
  port: parseInt(url.port) || 6379,
  password: url.password || undefined,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'post-publishing',
  async (job) => {
    console.log(`[Worker] Processing job ${job.id}: ${job.name}`, job.data);
    await processPublishJob(job.data);
    console.log(`[Worker] Job ${job.id} completed`);
  },
  { connection, concurrency: 5 },
);

worker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('[Worker] Error:', err);
});

const shutdown = async () => {
  console.log('[Worker] Shutting down gracefully…');
  await worker.close();
  connection.disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

console.log('[Worker] Loraloop post-publishing worker started');
