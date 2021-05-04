import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';

import { User } from '../../schema/User';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    id,
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
    token,
    confirmation,
  }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      id,
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
      token,
      confirmation,
    });

    await this.repository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.repository.findOne({ email });

    return user;
  }

  async findByToken(token: string): Promise<User | undefined> {
    const user = await this.repository.findOne({ token });

    return user;
  }
}
