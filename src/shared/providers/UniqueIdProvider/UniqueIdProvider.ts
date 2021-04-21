import { v4 as uuidV4 } from 'uuid';

import { IUniqueIdProvider } from './protocol/IUniqueIdProvider';

export class UniqueIdProvider implements IUniqueIdProvider {
  uuid(): string {
    return uuidV4();
  }
}
