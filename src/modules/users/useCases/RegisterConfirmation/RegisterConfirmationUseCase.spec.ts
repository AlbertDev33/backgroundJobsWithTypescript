/* eslint-disable max-classes-per-file */
import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';

import { RegisterConfirmationUseCase } from './RegisterConfirmationUseCase';

interface ISutTypes {
  sut: RegisterConfirmationUseCase;
  usersRepositoryStub: IUsersRepository;
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

const makeSut = (): ISutTypes => {
  const usersRepositoryStub = makeUsersRepository();

  const sut = new RegisterConfirmationUseCase(usersRepositoryStub);

  return {
    sut,
    usersRepositoryStub,
  };
};

describe('Register Confirmation', () => {
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

  it('Should be able to validate the user token', async () => {
    const { sut, usersRepositoryStub } = makeSut();

    jest
      .spyOn(usersRepositoryStub, 'findByToken')
      .mockReturnValueOnce(new Promise(resolve => resolve(fakeUser)));

    const validUserToken = await sut.execute(fakeUser.token);

    expect(validUserToken.token).toEqual(fakeUser.token);
    expect(validUserToken.confirmation).toBe(true);
  });

  it('Should throw if is invalid token', async () => {
    const { sut, usersRepositoryStub } = makeSut();

    jest
      .spyOn(usersRepositoryStub, 'findByToken')
      .mockReturnValueOnce(new Promise(resolve => resolve(undefined)));

    const invalidUserToken = sut.execute(fakeUser.token);

    await expect(invalidUserToken).rejects.toEqual(
      new AppError('Invalid Register'),
    );
  });
});
