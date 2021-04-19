/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable max-classes-per-file */

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';
import { IPasswordHashProvider } from '@shared/providers/HashProvider/protocol/IPasswordHashProvider';
import {
  ITokenManagerProvider,
  ITokenSource,
  IVerifySource,
} from '@shared/providers/TokenManager/protocol/ITokenManagerProvider';

import { UserSessionUseCase } from './UserSessionUseCase';

interface ISutTypes {
  sut: UserSessionUseCase;
  usersRepositoryStub: IUsersRepository;
  tokenManagerStub: ITokenManagerProvider;
  passwordHashProviderStub: IPasswordHashProvider;
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
        cep: 123456,
        street: 'valid_street',
        homeNumber: 100,
        district: 'valid_district',
        city: 'valid_city',
        state: 'valid_state',
        country: 'valid_country',
      };

      return new Promise(resolve => resolve(fakeUser));
    }

    findByEmail(email: string): Promise<User | undefined> {
      return new Promise(resolve => resolve(undefined));
    }
  }

  return new UsersRepositoryStub();
};

const makeTokenManager = (): ITokenManagerProvider => {
  class TokenManagerProviderStub implements ITokenManagerProvider {
    sign(data: ITokenSource): string {
      return 'generateToken';
    }
    verify({ token, secret }: IVerifySource): string | object {
      return token;
    }
  }

  return new TokenManagerProviderStub();
};

const makePasswordHashProvider = (): IPasswordHashProvider => {
  class PasswordHashProviderStub implements IPasswordHashProvider {
    async generateHash(payload: string): Promise<string> {
      const hashed = 'hashed_password';

      return hashed;
    }

    async compareHash(payload: string, hashed: string): Promise<boolean> {
      return true;
    }
  }

  return new PasswordHashProviderStub();
};

const makeSut = (): ISutTypes => {
  const usersRepositoryStub = makeUsersRepository();
  const tokenManagerStub = makeTokenManager();
  const passwordHashProviderStub = makePasswordHashProvider();

  const sut = new UserSessionUseCase(usersRepositoryStub, tokenManagerStub);

  return {
    sut,
    usersRepositoryStub,
    tokenManagerStub,
    passwordHashProviderStub,
  };
};

describe('User Session', () => {
  it('Should be abel to create a session for an registered user', async () => {
    const { sut, usersRepositoryStub } = makeSut();

    const fakeUser = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'any_mail@mail.com',
      password: 'valid_password',
      cpf: '123456',
      cep: 123456,
      street: 'valid_street',
      homeNumber: 100,
      district: 'valid_district',
      city: 'valid_city',
      state: 'valid_state',
      country: 'valid_country',
    };

    jest
      .spyOn(usersRepositoryStub, 'findByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(fakeUser)));

    const userSession = await sut.execute({
      email: fakeUser.email,
      password: fakeUser.password,
    });

    expect(userSession).toHaveProperty('token');
    expect(userSession.user).toBeTruthy();
  });

  it('Should throw if invalid user email', async () => {
    const { sut, usersRepositoryStub } = makeSut();

    const fakeUser = {
      email: 'invalid_email@mail.com',
      password: 'valid_password',
    };

    jest
      .spyOn(usersRepositoryStub, 'findByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve(undefined)));

    const unregisterUser = sut.execute({
      email: fakeUser.email,
      password: fakeUser.password,
    });

    await expect(unregisterUser).rejects.toEqual(
      new AppError('User not found!'),
    );
  });

  it('Should throw if invalid user password', async () => {
    const { sut, usersRepositoryStub, passwordHashProviderStub } = makeSut();
  });
});
