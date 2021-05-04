import { getRepository, Repository } from 'typeorm';

import { IUploadFileDTO } from '@modules/users/dtos/IUploadFileDTO';
import { FileUploads } from '@modules/users/infra/typeorm/schema/FileUploads';

import { IUploadsRespository } from '../protocol/IUploadsRepository';

export class UploadFilesRepository implements IUploadsRespository {
  private repository: Repository<FileUploads>;

  constructor() {
    this.repository = getRepository(FileUploads);
  }

  async create({
    number,
    bookValue,
    productName,
    uf,
    classification,
  }: IUploadFileDTO): Promise<FileUploads> {
    const fileUploads = this.repository.create({
      number,
      bookValue,
      productName,
      uf,
      classification,
    });

    await this.repository.save(fileUploads);

    return fileUploads;
  }
}
