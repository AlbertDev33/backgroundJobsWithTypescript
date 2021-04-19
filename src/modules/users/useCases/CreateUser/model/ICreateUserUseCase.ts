import { User } from '@modules/users/infra/typeorm/schema/User';
import { IRequest } from '@modules/users/useCases/CreateUser/CreateUserUseCase';

export interface ICreateUserUseCase {
  execute(data: IRequest): Promise<User>;
}
