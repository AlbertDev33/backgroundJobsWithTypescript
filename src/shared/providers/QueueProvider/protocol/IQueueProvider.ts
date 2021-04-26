import Queue from 'bull';

import { ISendMailSource } from '@shared/providers/QueueProvider/SendMailService/implementations/SendMailUseCase';

export interface IQueueProvider {
  addQueue(
    queueName: string,
    data: ISendMailSource,
  ): Promise<Queue.Job | undefined>;
  processQueue(): Promise<void>;
}
