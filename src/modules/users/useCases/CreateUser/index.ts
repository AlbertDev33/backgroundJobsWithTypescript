import { UsersRepository } from '@modules/users/infra/typeorm/repositories/implementations/UsersRepository';
import { TransformerProvider } from '@shared/providers/ClassTransformerProvider/TransformerProvider';
import { CpfValidatorProvider } from '@shared/providers/CpfValidatorProvider/CpfValidatorProvider';
import { PasswordHashProvider } from '@shared/providers/HashProvider/PasswordHashProvider';
import { QueueProvider } from '@shared/providers/QueueProvider/QueueProvider';
import { RequestProvider } from '@shared/providers/RequestProvider/RequestProvider';
import { UniqueIdProvider } from '@shared/providers/UniqueIdProvider/UniqueIdProvider';

import { CreateUserController } from './CreateUserController';
import { CreateUserUseCase } from './CreateUserUseCase';

const makeCreateUserController = (): CreateUserController => {
  const usersRepository = new UsersRepository();
  const cpfValidatorProvider = new CpfValidatorProvider();
  const passwordHashProvider = new PasswordHashProvider();
  const requestProvider = new RequestProvider();
  const uniqueIdProvider = new UniqueIdProvider();

  const queueProvider = new QueueProvider();

  const createUserUseCase = new CreateUserUseCase(
    usersRepository,
    cpfValidatorProvider,
    passwordHashProvider,
    requestProvider,
    uniqueIdProvider,
    queueProvider,
  );

  const transformerProvider = new TransformerProvider();

  return new CreateUserController(createUserUseCase, transformerProvider);
};

export { makeCreateUserController };
