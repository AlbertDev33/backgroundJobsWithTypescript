import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';

import { User } from '../../schema/User';

export class UsersRepository implements IUsersRepository {
  private users: User[] = [];

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
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
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
    });

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(user => user.email === email);

    return user;
  }
}
