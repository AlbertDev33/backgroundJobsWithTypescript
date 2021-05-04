/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Busboy from 'busboy';
import fs from 'fs';

import uploadConfig from '@config/upload';
import { IUploadFilesUseCase } from '@modules/users/useCases/UploadFiles/model/IUploadFilesUseCase';

import {
  IRequest,
  IResponse,
} from '../ExpressRequestProvider/ExpressRequestProvider';
import { IFilePathProvider } from '../FilePathProvider/model/IFilePathProvider';
import { IHashNameFilesProvider } from '../HashNameFilesProvider/protocol/IHashNameFilesProvider';
import { IUploadFileProvider } from './protocol/IUploadFileProvider';

export class UploadFileProvider implements IUploadFileProvider {
  constructor(
    private hashNameFilesProvider: IHashNameFilesProvider,

    private filePathProvider: IFilePathProvider,

    private uploadFilesUseCase: IUploadFilesUseCase,
  ) {}

  async upload(request: IRequest, response: IResponse): Promise<IResponse> {
    const busboy = new Busboy({ headers: request.headers });

    busboy.on('file', (fieldname, file, filename) => {
      const fileHash = this.hashNameFilesProvider.hash(10);
      const fileName = `${fileHash}-${filename}`;

      const tmpFolder = this.filePathProvider.resolve(
        uploadConfig.tmpFolder,
        fileName,
      );

      const newFile = file.pipe(fs.createWriteStream(tmpFolder));

      newFile.on('close', () => {
        this.uploadFilesUseCase.execute(tmpFolder);
      });
    });

    // busboy.on('finish', () => {
    //   response.writeHead(201, { Connection: 'close' });
    //   response.end('Upload realizado com sucesso!');
    // });

    request.pipe(busboy);

    return response.status(204);
  }
}
