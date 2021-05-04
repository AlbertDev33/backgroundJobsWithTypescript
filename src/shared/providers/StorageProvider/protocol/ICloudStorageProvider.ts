export interface ICloudStorageProvider {
  saveFile(file: string): Promise<string>;
}
