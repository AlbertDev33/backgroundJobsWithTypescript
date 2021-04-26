import Queue from 'bull';

import redisConfig from '@config/cache';
import {
  ISendMailSource,
  SendMailUseCase,
} from '@shared/providers/QueueProvider/SendMailService/implementations/SendMailUseCase';

import { IQueueProvider } from './protocol/IQueueProvider';

const sendMail = new SendMailUseCase();

export class QueueProvider implements IQueueProvider {
  constructor(
    private queues = [
      {
        bull: new Queue(sendMail.key, {
          redis: redisConfig,
        }),
        name: sendMail.key,
        handle: sendMail.execute,
      },
    ],
  ) {}

  async addQueue(
    queueName: string,
    data: ISendMailSource,
  ): Promise<Queue.Job | undefined> {
    const queue = this.queues.find(queue => queue.name === queueName);

    const { name, token, email } = data;

    const responseParameters = this.queues.map(queue =>
      queue.handle({ name, token, email }),
    );

    return queue?.bull.add(responseParameters);
  }

  async processQueue(): Promise<void> {
    this.queues.forEach(async queue => {
      await queue.bull.process(() => queue.handle);

      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.name, job.data);
        console.log(err);
      });
    });
  }
}
