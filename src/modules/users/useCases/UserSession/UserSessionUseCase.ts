import auth from '@config/auth';
import { IUsersRepository } from '@modules/users/infra/typeorm/repositories/protocol/IUsersRepositories';
import { User } from '@modules/users/infra/typeorm/schema/User';
import { AppError } from '@shared/errors/AppError';
import { IPasswordHashProvider } from '@shared/providers/HashProvider/protocol/IPasswordHashProvider';
import { ITokenManagerProvider } from '@shared/providers/TokenManager/protocol/ITokenManagerProvider';

import { IUserSessionUseCase } from './model/IUserSessionUseCase';

export interface IUserSessionSource {
  email: string;
  password: string;
}

export interface IResponseSession {
  user: User;
  token: string;
}

export class UserSessionUseCase implements IUserSessionUseCase {
  constructor(
    private usersRepository: IUsersRepository,

    private tokenManagerProvider: ITokenManagerProvider,

    private passwordHashProvider: IPasswordHashProvider,
  ) {}

  async execute({
    email,
    password,
  }: IUserSessionSource): Promise<IResponseSession> {
    const existsUser = await this.usersRepository.findByEmail(email);

    if (!existsUser) {
      throw new AppError('Invalid e-mail or password!');
    }

    const isValidPassword = await this.passwordHashProvider.compareHash(
      password,
      existsUser.password,
    );

    if (!isValidPassword) {
      throw new AppError('Invalid e-mail or password!');
    }

    if (!existsUser.confirmation) {
      throw new AppError(
        'User not Confirmed! Please, Confirm Your E-mail Address.',
      );
    }

    const token = this.generateToken(existsUser.id);

    return {
      token,
      user: existsUser,
    };
  }

  private generateToken(userId: string): string {
    const { secret, expiresIn } = auth.jwt;

    const token = this.tokenManagerProvider.sign({
      payload: {},
      secret,
      options: { subject: userId, expiresIn },
    });

    return token;
  }
}
