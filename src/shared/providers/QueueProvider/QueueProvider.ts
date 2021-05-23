import Queue from 'bull';

import redisConfig from '@config/cache';
import { makeSendMailUseCase } from '@modules/users/useCases/SendMail';
import {
  ISendMailSource,
  SendMailUseCase,
} from '@modules/users/useCases/SendMail/SendMailUseCase';
import { AppError } from '@shared/errors/AppError';

import { IQueueProvider } from './protocol/IQueueProvider';

const sendMailUseCase = makeSendMailUseCase();

const jobs = [sendMailUseCase];

interface IQueueObject {
  [key: string]: {
    bull: Queue.Queue<any>;
    name: string;
    handle: (data: ISendMailSource) => void;
  };
}

export class QueueProvider implements IQueueProvider {
  private queues: IQueueObject = {};

  constructor() {
    this.init();
  }

  init(): void {
    jobs.forEach(({ key, execute }: SendMailUseCase) => {
      this.queues[key] = {
        bull: new Queue(key, { redis: redisConfig }),
        name: key,
        handle: execute,
      };
    });
  }

  async addQueue(
    queueName: string,
    data: ISendMailSource,
  ): Promise<Queue.Job | undefined> {
    const queue = jobs.find(queue => queue.key === queueName);

    if (!queue) {
      throw new AppError('Queue undefined');
    }

    const responseParameters = jobs.map(queue => queue.execute(data));

    return this.queues[queue.key].bull.add(responseParameters);
  }

  async processQueue(): Promise<void> {
    jobs.forEach(async queue => {
      const { bull, handle } = this.queues[queue.key];

      await bull.process(() => handle);

      bull.on('failed', (job, err) => {
        console.log('Job failed', job.name, job.data);
        console.log(err);
      });
    });
  }
}
