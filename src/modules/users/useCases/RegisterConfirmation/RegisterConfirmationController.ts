import { ITransformerProvider } from '@shared/providers/ClassTransformerProvider/model/ITransformerProvider';
import {
  IRequest,
  IResponse,
} from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';
import { IExpressRequestProvider } from '@shared/providers/ExpressRequestProvider/protocol/IExpressRequestProvider';

import { IRegisterConfirmationUseCase } from './model/IRegisterConfirmationUseCase';

export class RegisterConfirmationController implements IExpressRequestProvider {
  constructor(
    private registerConfirmationUseCase: IRegisterConfirmationUseCase,

    private transformerProvider: ITransformerProvider,
  ) {}

  async handle(request: IRequest, response: IResponse): Promise<IResponse> {
    const { token } = request.query;

    const confirmation = await this.registerConfirmationUseCase.execute(
      String(token),
    );

    return response
      .status(200)
      .json(this.transformerProvider.internalTransform(confirmation));
  }
}
