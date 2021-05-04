export interface ILocalStorageProvider {
  saveFile(file: string): Promise<string>;
}
