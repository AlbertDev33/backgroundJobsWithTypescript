import { UsersRepository } from '@modules/users/infra/typeorm/repositories/implementations/UsersRepository';
import { TransformerProvider } from '@shared/providers/ClassTransformerProvider/TransformerProvider';

import { RegisterConfirmationController } from './RegisterConfirmationController';
import { RegisterConfirmationUseCase } from './RegisterConfirmationUseCase';

const makeRegisterConfirmationController = (): RegisterConfirmationController => {
  const usersRepository = new UsersRepository();

  const registerConfirmationUseCase = new RegisterConfirmationUseCase(
    usersRepository,
  );

  const transformerProvider = new TransformerProvider();

  return new RegisterConfirmationController(
    registerConfirmationUseCase,
    transformerProvider,
  );
};

export { makeRegisterConfirmationController };
