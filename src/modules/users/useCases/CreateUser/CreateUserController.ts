import { ITransformerProvider } from '@shared/providers/ClassTransformerProvider/model/ITransformerProvider';
import {
  IRequest,
  IResponse,
} from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';
import { IExpressRequestProvider } from '@shared/providers/ExpressRequestProvider/protocol/IExpressRequestProvider';

import { ICreateUserUseCase } from './model/ICreateUserUseCase';

export class CreateUserController implements IExpressRequestProvider {
  constructor(
    private createUserUseCase: ICreateUserUseCase,

    private transformerProvider: ITransformerProvider,
  ) {}

  async handle(request: IRequest, response: IResponse): Promise<IResponse> {
    const { name, email, password, cpf, cep, homeNumber } = request.body;

    const user = await this.createUserUseCase.execute({
      name,
      email,
      password,
      cpf,
      cep,
      homeNumber,
    });

    return response
      .status(201)
      .json(this.transformerProvider.internalTransform(user));
  }
}
