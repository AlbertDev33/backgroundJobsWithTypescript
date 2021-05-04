import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';

import { IRegisterConfirmationUseCase } from './model/IRegisterConfirmationUseCase';

export class RegisterConfirmationUseCase
  implements IRegisterConfirmationUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(token: string): Promise<User> {
    const user = await this.usersRepository.findByToken(token);

    if (!user) {
      throw new AppError('Invalid Register');
    }

    const userConfirmed = true;
    user.confirmation = userConfirmed;

    await this.usersRepository.create(user);

    return user;
  }
}
