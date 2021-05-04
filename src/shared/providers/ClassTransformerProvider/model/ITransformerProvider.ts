import { IClassTransformOption } from '../TransformerProvider';

export interface ITransformerProvider {
  internalTransform<T>(object: T, options?: IClassTransformOption): T;
}
