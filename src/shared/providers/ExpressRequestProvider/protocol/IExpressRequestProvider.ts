import { IRequest, IResponse } from '../ExpressRequestProvider';

export interface IExpressRequestProvider {
  handle(request: IRequest, response: IResponse): Promise<IRequest | IResponse>;
}
