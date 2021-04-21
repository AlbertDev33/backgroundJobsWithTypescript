export interface IFilePathProvider {
  resolve(...pathSegments: string[]): string;
  basename(filePath: string, ext?: string | undefined): string;
}
