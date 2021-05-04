import {
  IRequest,
  IResponse,
} from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';
import { IExpressRequestProvider } from '@shared/providers/ExpressRequestProvider/protocol/IExpressRequestProvider';
import { IUploadFileProvider } from '@shared/providers/UploadFilesProvider/protocol/IUploadFileProvider';

export class UploadFilesController implements IExpressRequestProvider {
  constructor(private uploadFileProvider: IUploadFileProvider) {}

  async handle(
    request: IRequest,
    response: IResponse,
  ): Promise<IRequest | IResponse> {
    await this.uploadFileProvider.upload(request, response);

    return response.status(204).send();
  }
}
