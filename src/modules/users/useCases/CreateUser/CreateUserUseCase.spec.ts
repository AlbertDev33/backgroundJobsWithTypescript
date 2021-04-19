/* eslint-disable max-classes-per-file */
import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';
import { ICpfValidatorProvider } from '@shared/providers/CpfValidatorProvider/protocol/ICpfValidatorProvider';

import { CreateUserUseCase } from './CreateUserUseCase';

interface ISutTypes {
  sut: CreateUserUseCase;
  usersRepositoryStub: IUsersRepository;
  cpfValidatorStub: ICpfValidatorProvider;
}

const makeCpfValidator = (): ICpfValidatorProvider => {
  class CpfValidatorStub implements ICpfValidatorProvider {
    isValid(cpf: string): boolean {
      return true;
    }
  }

  return new CpfValidatorStub();
};

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

const makeSut = (): ISutTypes => {
  const usersRepositoryStub = makeUsersRepository();
  const cpfValidatorStub = makeCpfValidator();

  const sut = new CreateUserUseCase(usersRepositoryStub, cpfValidatorStub);

  return {
    usersRepositoryStub,
    sut,
    cpfValidatorStub,
  };
};

describe('Users', () => {
  it('Should be able to create a valid user', async () => {
    const { sut } = makeSut();

    const fakeUser = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
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

    const user = await sut.execute(fakeUser);

    expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a user with used email', async () => {
    const { sut, usersRepositoryStub } = makeSut();

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

    jest
      .spyOn(usersRepositoryStub, 'findByEmail')
      .mockReturnValue(new Promise(resolve => resolve(fakeUser)));

    const invalidUser = sut.execute(fakeUser);

    await expect(invalidUser).rejects.toEqual(new AppError('Invalid email'));
  });

  it('Should not be able to create a user with invalid cpf', async () => {
    const { sut, cpfValidatorStub } = makeSut();

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

    jest.spyOn(cpfValidatorStub, 'isValid').mockReturnValueOnce(false);

    const userWithInvalidCpf = sut.execute(fakeUser);

    await expect(userWithInvalidCpf).rejects.toEqual(
      new AppError('Invalid CPF'),
    );
  });
});
