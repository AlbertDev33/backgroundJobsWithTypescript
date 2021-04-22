import Queue from 'bull';

import redisConfig from '@config/cache';

import jobs from './index';
import { IQueueProvider } from './protocol/IQueueProvider';

export class QueueProvider implements IQueueProvider {
  private queues = Object.values(jobs).map(job => ({
    bull: new Queue(job.key, { redis: redisConfig }),
    name: job.key,
    execute: job.execute,
  }));

  async addQueue(queueName: string, data: any): Promise<Queue.Job | undefined> {
    const queue = this.queues.find(queue => queue.name === queueName);

    return queue?.bull.add(data);
  }

  async processQueue(): Promise<void> {
    this.queues.forEach(async queue => {
      await queue.bull.process(queue.execute);

      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.name, job.data);
        console.log(err);
      });
    });
  }
}
