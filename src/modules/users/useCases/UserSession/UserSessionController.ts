import { ITransformerProvider } from '@shared/providers/ClassTransformerProvider/model/ITransformerProvider';
import {
  IRequest,
  IResponse,
} from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';
import { IExpressRequestProvider } from '@shared/providers/ExpressRequestProvider/protocol/IExpressRequestProvider';

import { IUserSessionUseCase } from './model/IUserSessionUseCase';

export class UserSessionController implements IExpressRequestProvider {
  constructor(
    private userSessionUseCase: IUserSessionUseCase,

    private transformerProvider: ITransformerProvider,
  ) {}

  async handle(
    request: IRequest,
    response: IResponse,
  ): Promise<IRequest | IResponse> {
    const { email, password } = request.body;

    const session = await this.userSessionUseCase.execute({
      email,
      password,
    });

    return response
      .status(200)
      .json(this.transformerProvider.internalTransform(session));
  }
}
