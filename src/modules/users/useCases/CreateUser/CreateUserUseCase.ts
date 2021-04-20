import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';
import { ICpfValidatorProvider } from '@shared/providers/CpfValidatorProvider/protocol/ICpfValidatorProvider';
import { IPasswordHashProvider } from '@shared/providers/HashProvider/protocol/IPasswordHashProvider';
import { IRequestProvider } from '@shared/providers/RequestProvider/protocol/IRequestProvider';

import { ICreateUserUseCase } from './model/ICreateUserUseCase';

export interface IRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  cep: string;
  homeNumber: number;
}

export interface IResponseSource {
  readonly cep: string;
  readonly logradouro: string;
  readonly bairro: string;
  readonly localidade: string;
  readonly uf: string;
}

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,

    private cpfValidatorProvider: ICpfValidatorProvider,

    private passwordHashProvider: IPasswordHashProvider,

    private requestProvider: IRequestProvider,
  ) {}

  async execute({
    name,
    email,
    password,
    cpf,
    cep,
    homeNumber,
  }: IRequest): Promise<User> {
    const findUser = await this.usersRepository.findByEmail(email);

    if (findUser) {
      throw new AppError('Invalid email');
    }

    const isValidCpf = this.cpfValidatorProvider.isValid(cpf);

    if (!isValidCpf) {
      throw new AppError('Invalid CPF');
    }

    const validacep = /^[0-9]{8}$/;

    if (!validacep.test(cep)) {
      throw new AppError('Invalid CEP number!');
    }

    const apiResponse = await this.callCepApi(cep);

    const { bairro, logradouro, localidade, uf } = apiResponse;

    const hashedPassword = await this.passwordHashProvider.generateHash(
      password,
    );

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      cpf,
      cep,
      street: logradouro,
      homeNumber,
      district: bairro,
      city: localidade,
      state: uf,
      country: 'Brasil',
    });

    return user;
  }

  private async callCepApi(cep: string): Promise<IResponseSource> {
    const response = await this.requestProvider.get<IResponseSource>(
      `https://viacep.com.br/ws/${cep}/json/`,
    );

    const { data } = response;

    return data;
  }
}
