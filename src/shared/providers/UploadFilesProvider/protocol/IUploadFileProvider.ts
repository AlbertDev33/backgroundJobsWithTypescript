import {
  IRequest,
  IResponse,
} from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';

export interface IUploadFileProvider
  extends Omit<Pick<NodeJS.WritableStream, 'on'>, 'on'> {
  upload(request: IRequest, response: IResponse): Promise<IResponse>;
}
