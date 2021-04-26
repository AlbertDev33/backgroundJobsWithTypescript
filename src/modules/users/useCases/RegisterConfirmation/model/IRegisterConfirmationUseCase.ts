import { User } from '@modules/users/infra/typeorm/schema/User';

export interface IRegisterConfirmationUseCase {
  execute(token: string): Promise<User>;
}
