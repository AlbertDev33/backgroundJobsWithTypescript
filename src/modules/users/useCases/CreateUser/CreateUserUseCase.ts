import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';
import { ICpfValidatorProvider } from '@shared/providers/CpfValidatorProvider/protocol/ICpfValidatorProvider';

type IRequest = Omit<ICreateUserDTO, 'id'>;

export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

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

    const user = await this.usersRepository.create({
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
    });

    return user;
  }
}
