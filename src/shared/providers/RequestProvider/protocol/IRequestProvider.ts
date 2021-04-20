import { IRequestConfig, IResponse } from '../RequestProvider';

export interface IRequestProvider {
  get<T>(url: string, config?: IRequestConfig): Promise<IResponse<T>>;
}
