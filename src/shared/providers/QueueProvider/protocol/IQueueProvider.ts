import Queue from 'bull';

import { ISendMailSource } from '@modules/users/useCases/SendMail/SendMailUseCase';

export interface IQueueProvider {
  addQueue(
    queueName: string,
    data: ISendMailSource,
  ): Promise<Queue.Job | undefined>;
  processQueue(): Promise<void>;
}
