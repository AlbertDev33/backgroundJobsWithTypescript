import Queue from 'bull';

export interface IQueueProvider {
  addQueue(queueName: string, data: any): Promise<Queue.Job | undefined>;
  processQueue(): Promise<void>;
}
