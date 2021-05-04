/* eslint-disable consistent-return */
import csvParse from 'csv-parse';
import fs from 'fs';

import { IUploadsRespository } from '@modules/users/infra/typeorm/repositories/protocol/IUploadsRepository';

import { IUploadFilesUseCase } from './model/IUploadFilesUseCase';

export interface IUploadFieldsFile {
  number: string;
  bookValue: string;
  uf: string;
  productName: string;
  classification: string;
}

export class UploadFilesUseCase implements IUploadFilesUseCase {
  constructor(private uploadsRepository: IUploadsRespository) {}

  async execute(filePath: string): Promise<void> {
    const uploadFile = await this.loadFileContent(filePath);

    uploadFile.map(async file => {
      const { number, bookValue, uf, productName, classification } = file;

      await this.uploadsRepository.create({
        number,
        bookValue,
        uf,
        productName,
        classification,
      });
    });
  }

  private async loadFileContent(
    filePath: string,
  ): Promise<IUploadFieldsFile[]> {
    return new Promise((resolve, reject) => {
      const fileReadStream = fs.createReadStream(filePath);

      const parserFile = csvParse({ from_line: 2 });

      fileReadStream.pipe(parserFile);

      const uploadFile: IUploadFieldsFile[] = [];

      parserFile
        .on('data', async line => {
          const [number, bookValue, uf, productName, classification] = line;

          uploadFile.push(number, bookValue, uf, productName, classification);
          console.log(uploadFile);
        })
        .on('end', () => {
          fs.promises.unlink(filePath);
          resolve(uploadFile);
        })
        .on('error', err => reject(err));
    });
  }
}
