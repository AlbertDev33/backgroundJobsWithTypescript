import { hash, compare } from 'bcrypt';

import { IPasswordHashProvider } from './protocol/IPasswordHashProvider';

export class PasswordHashProvider implements IPasswordHashProvider {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 10);
  }
  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
