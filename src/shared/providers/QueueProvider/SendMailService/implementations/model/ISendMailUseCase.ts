import { ISendMailSource } from '../SendMailUseCase';

export interface ISendMailUseCase {
  execute({ name, token, email }: ISendMailSource): Promise<void>;
}
