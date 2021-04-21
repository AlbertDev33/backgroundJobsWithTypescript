import path from 'path';

import { IFilePathProvider } from './model/IFilePathProvider';

export class FilePathProvider implements IFilePathProvider {
  resolve(...pathSegments: string[]): string {
    const filePath = path.resolve(...pathSegments);

    return filePath;
  }
  basename(filePath: string, ext?: string): string {
    return path.basename(filePath, ext);
  }
}
