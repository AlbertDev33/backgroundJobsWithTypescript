import crypto from 'crypto';

import { IHashNameFilesProvider } from './protocol/IHashNameFilesProvider';

export class HashNameFilesProvider implements IHashNameFilesProvider {
  hash(salt: number): string {
    const hashedName = crypto.randomBytes(salt).toString('hex');

    return hashedName;
  }
}
