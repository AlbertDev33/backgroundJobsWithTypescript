/* eslint-disable @typescript-eslint/ban-types */
import { sign, verify } from 'jsonwebtoken';

import {
  ITokenManagerProvider,
  ITokenSource,
  IVerifySource,
} from './protocol/ITokenManagerProvider';

export class TokenManagerProvider implements ITokenManagerProvider {
  sign({ payload, secret, options }: ITokenSource): string {
    return sign(payload, secret, options);
  }
  verify({ token, secret }: IVerifySource): string | object {
    return verify(token, secret);
  }
}
