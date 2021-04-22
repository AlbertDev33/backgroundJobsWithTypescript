/* eslint-disable max-classes-per-file */
import Queue from 'bull';
import { v4 } from 'uuid';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';
import { ICpfValidatorProvider } from '@shared/providers/CpfValidatorProvider/protocol/ICpfValidatorProvider';
import { IPasswordHashProvider } from '@shared/providers/HashProvider/protocol/IPasswordHashProvider';
import { IQueueProvider } from '@shared/providers/QueueProvider/protocol/IQueueProvider';
import { IRequestProvider } from '@shared/providers/RequestProvider/protocol/IRequestProvider';
import {
  IRequestConfig,
  IResponse,
} from '@shared/providers/RequestProvider/RequestProvider';
import { IUniqueIdProvider } from '@shared/providers/UniqueIdProvider/protocol/IUniqueIdProvider';

import { CreateUserUseCase } from './CreateUserUseCase';

interface ISutTypes {
  sut: CreateUserUseCase;
  usersRepositoryStub: IUsersRepository;
  cpfValidatorStub: ICpfValidatorProvider;
  passwordHashProviderStub: IPasswordHashProvider;
  requestProviderStub: IRequestProvider;
  queueProviderStub: IQueueProvider;
}

const makeUsersRepository = (): IUsersRepository => {
  class UsersRepositoryStub implements IUsersRepository {
    async create(data: ICreateUserDTO): Promise<User> {
      const fakeUser = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'any_mail@mail.com',
        password: 'hashed_password',
        cpf: '123456',
        cep: '123456',
        street: 'valid_street',
        homeNumber: 100,
        district: 'valid_district',
        city: 'valid_city',
        state: 'valid_state',
        country: 'valid_country',
        token: 'valid_token',
        confirmation: false,
        created_at: new Date(Date.now()),
      };

      return new Promise(resolve => resolve(fakeUser));
    }

    findByEmail(email: string): Promise<User | undefined> {
      return new Promise(resolve => resolve(undefined));
    }

    findByToken(token: string): Promise<User | undefined> {
      return new Promise(resolve => resolve(undefined));
    }
  }

  return new UsersRepositoryStub();
};

const makeCpfValidator = (): ICpfValidatorProvider => {
  class CpfValidatorStub implements ICpfValidatorProvider {
    isValid(cpf: string): boolean {
      return true;
    }
  }

  return new CpfValidatorStub();
};

const makePasswordHash = (): IPasswordHashProvider => {
  class PasswordHashProviderStub implements IPasswordHashProvider {
    generateHash(payload: string): Promise<string> {
      const hash = 'hashed_password';

      return new Promise(resolve => resolve(hash));
    }
    compareHash(payload: string, hashed: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }

  return new PasswordHashProviderStub();
};

const makeRequestProvider = (): IRequestProvider => {
  class RequestProviderStub implements IRequestProvider {
    get<IResponseSource>(
      url: string,
      config?: IRequestConfig,
    ): Promise<IResponse<IResponseSource>> {
      const mockedReturnAxios = {
        cep: '11001-765',
        logradouro: 'Praça da Sé',
        complemento: 'lado ímpar',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
      };

      return new Promise(resolve =>
        resolve({ data: mockedReturnAxios } as IResponse),
      );
    }
  }

  return new RequestProviderStub();
};

const makeQueueProvider = (): IQueueProvider => {
  class QueueProviderStub implements IQueueProvider {
    async addQueue(
      queueName: string,
      data: any,
    ): Promise<Queue.Job | undefined> {
      return undefined;
    }
    async processQueue(): Promise<void> {
      Array.prototype.forEach(test => test);
    }
  }

  return new QueueProviderStub();
};

const makeUniqueIdProvider = (): IUniqueIdProvider => {
  class UniqueIdProviderStub implements IUniqueIdProvider {
    uuid(): string {
      return v4();
    }
  }

  return new UniqueIdProviderStub();
};

const makeSut = (): ISutTypes => {
  const usersRepositoryStub = makeUsersRepository();
  const cpfValidatorStub = makeCpfValidator();
  const passwordHashProviderStub = makePasswordHash();
  const requestProviderStub = makeRequestProvider();
  const uniqueIdProviderStub = makeUniqueIdProvider();
  const queueProviderStub = makeQueueProvider();

  const sut = new CreateUserUseCase(
    usersRepositoryStub,
    cpfValidatorStub,
    passwordHashProviderStub,
    requestProviderStub,
    uniqueIdProviderStub,
    queueProviderStub,
  );

  return {
    usersRepositoryStub,
    sut,
    cpfValidatorStub,
    passwordHashProviderStub,
    requestProviderStub,
    queueProviderStub,
  };
};

describe('Create Users', () => {
  const fakeUser = {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
    cpf: '123456',
    cep: '11001765',
    homeNumber: 100,
  };

  it('Should be able to create a valid user', async () => {
    const { sut } = makeSut();

    const user = await sut.execute(fakeUser);

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a user with used email', async () => {
    const { sut, usersRepositoryStub } = makeSut();

    const userTest = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      cpf: '123456',
      cep: '11001765',
      street: 'valid_street',
      homeNumber: 100,
      district: 'valid_district',
      city: 'valid_city',
      state: 'valid_state',
      country: 'valid_country',
      token: 'valid_token',
      confirmation: false,
      created_at: new Date(Date.now()),
    };

    jest
      .spyOn(usersRepositoryStub, 'findByEmail')
      .mockReturnValue(new Promise(resolve => resolve(userTest)));

    const invalidUser = sut.execute(fakeUser);

    await expect(invalidUser).rejects.toEqual(new AppError('Invalid email'));
  });

  it('Should not be able to create a user with invalid cpf', async () => {
    const { sut, cpfValidatorStub } = makeSut();

    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false);

    const userWithInvalidCpf = sut.execute(fakeUser);

    await expect(userWithInvalidCpf).rejects.toEqual(
      new AppError('Invalid CPF'),
    );
  });

  it('Should be able to hash the user password', async () => {
    const { sut } = makeSut();

    const hashedPasswordUser = await sut.execute(fakeUser);

    expect(hashedPasswordUser.password).toEqual('hashed_password');
  });

  it('Should return address for a valid user params', async () => {
    const { sut, usersRepositoryStub } = makeSut();

    const userTest = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
      cpf: '123456',
      cep: '11001-765',
      street: 'Praça da Sé',
      homeNumber: 100,
      district: 'Sé',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      token: 'valid_token',
      confirmation: false,
      created_at: new Date(Date.now()),
    };

    jest
      .spyOn(usersRepositoryStub, 'create')
      .mockReturnValueOnce(new Promise(resolve => resolve(userTest)));

    const returnApi = await sut.execute(fakeUser);

    expect(returnApi).toEqual(userTest);
  });

  it('Should not be able to call api if invalid cep', async () => {
    const { sut } = makeSut();

    const userTest = {
      ...fakeUser,
      cep: 'invalid_cep',
    };

    const response = sut.execute(userTest);

    await expect(response).rejects.toEqual(new AppError('Invalid CEP number!'));
  });

  it('Should be able to call queue', async () => {
    const { sut, queueProviderStub } = makeSut();

    const spyQueue = jest.spyOn(queueProviderStub, 'addQueue');

    await sut.execute(fakeUser);

    expect(spyQueue).toHaveBeenCalled();
  });
});
