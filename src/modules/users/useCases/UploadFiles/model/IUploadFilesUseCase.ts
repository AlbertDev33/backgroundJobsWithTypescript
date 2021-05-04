import { IUploadFieldsFile } from '../UploadFilesUseCase';

export interface IUploadFilesUseCase {
  execute(fileName: string): Promise<void>;
}
