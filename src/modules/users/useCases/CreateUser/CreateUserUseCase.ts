import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';
import { ICpfValidatorProvider } from '@shared/providers/CpfValidatorProvider/protocol/ICpfValidatorProvider';
import { IPasswordHashProvider } from '@shared/providers/HashProvider/protocol/IPasswordHashProvider';

type IRequest = Omit<ICreateUserDTO, 'id'>;

export class CreateUserUseCase {
  constructor(
    private usersRepository: IUsersRepository,

    private cpfValidatorProvider: ICpfValidatorProvider,

    private passwordHashProvider: IPasswordHashProvider,
  ) {}

  async execute({
    name,
    email,
    password,
    cpf,
    cep,
    street,
    homeNumber,
    district,
    city,
    state,
    country,
  }: IRequest): Promise<User> {
    const findUser = await this.usersRepository.findByEmail(email);

    if (findUser) {
      throw new AppError('Invalid email');
    }

    const isValidCpf = this.cpfValidatorProvider.isValid(cpf);

    if (!isValidCpf) {
      throw new AppError('Invalid CPF');
    }

    const hashedPassword = await this.passwordHashProvider.generateHash(
      password,
    );

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      cpf,
      cep,
      street,
      homeNumber,
      district,
      city,
      state,
      country,
    });

    return user;
  }
}
