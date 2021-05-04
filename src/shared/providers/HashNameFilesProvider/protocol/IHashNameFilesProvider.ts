export interface IHashNameFilesProvider {
  hash(salt: number): string;
}
