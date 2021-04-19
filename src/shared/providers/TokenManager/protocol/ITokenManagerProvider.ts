/* eslint-disable @typescript-eslint/ban-types */
export interface ISignOptions {
  subject?: string;
  expiresIn?: string | number;
}

export interface ITokenSource {
  payload: string | object;
  secret: string;
  options?: ISignOptions;
}

export interface IVerifySource {
  token: string;
  secret: string;
}

export interface ITokenManagerProvider {
  sign(data: ITokenSource): string;
  verify(data: IVerifySource): string | object;
}
