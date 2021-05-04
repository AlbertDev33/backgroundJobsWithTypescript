import { UsersRepository } from '@modules/users/infra/typeorm/repositories/implementations/UsersRepository';
import { TransformerProvider } from '@shared/providers/ClassTransformerProvider/TransformerProvider';
import { PasswordHashProvider } from '@shared/providers/HashProvider/PasswordHashProvider';
import { TokenManagerProvider } from '@shared/providers/TokenManager/TokenManagerProvider';

import { UserSessionController } from './UserSessionController';
import { UserSessionUseCase } from './UserSessionUseCase';

const makeSessionController = (): UserSessionController => {
  const usersRepository = new UsersRepository();
  const tokenManagerProvider = new TokenManagerProvider();
  const passwordHashProvider = new PasswordHashProvider();

  const userSessionUseCase = new UserSessionUseCase(
    usersRepository,
    tokenManagerProvider,
    passwordHashProvider,
  );

  const transformerProvider = new TransformerProvider();

  return new UserSessionController(userSessionUseCase, transformerProvider);
};

export { makeSessionController };
