import { IUploadFileDTO } from '@modules/users/dtos/IUploadFileDTO';
import { FileUploads } from '@modules/users/infra/typeorm/schema/FileUploads';

export interface IUploadsRespository {
  create(data: IUploadFileDTO): Promise<FileUploads>;
}
