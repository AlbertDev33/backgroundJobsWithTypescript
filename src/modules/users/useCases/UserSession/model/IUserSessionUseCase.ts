import {
  IResponseSession,
  IUserSessionSource,
} from '@modules/users/useCases/UserSession/UserSessionUseCase';

export interface IUserSessionUseCase {
  execute({ email, password }: IUserSessionSource): Promise<IResponseSession>;
}
