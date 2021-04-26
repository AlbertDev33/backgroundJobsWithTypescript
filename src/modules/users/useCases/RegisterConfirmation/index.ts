import { UsersRepository } from '@modules/users/infra/typeorm/repositories/implementations/UsersRepository';

import { RegisterConfirmationController } from './RegisterConfirmationController';
import { RegisterConfirmationUseCase } from './RegisterConfirmationUseCase';

const makeRegisterConfirmationController = (): RegisterConfirmationController => {
  const usersRepository = new UsersRepository();

  const registerConfirmationUseCase = new RegisterConfirmationUseCase(
    usersRepository,
  );

  return new RegisterConfirmationController(registerConfirmationUseCase);
};

export { makeRegisterConfirmationController };
