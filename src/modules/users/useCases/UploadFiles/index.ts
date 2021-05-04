import { UploadFilesRepository } from '@modules/users/infra/typeorm/repositories/implementations/UploadFilesRespository';
import { FilePathProvider } from '@shared/providers/FilePathProvider/FilePathProvider';
import { HashNameFilesProvider } from '@shared/providers/HashNameFilesProvider/HashNameFilesProvider';
import { UploadFileProvider } from '@shared/providers/UploadFilesProvider/UploadFileProvider';

import { UploadFilesController } from './UploadFilesController';
import { UploadFilesUseCase } from './UploadFilesUseCase';

const makeUploadFilesController = (): UploadFilesController => {
  const hashNameFileProvider = new HashNameFilesProvider();
  const filePahtProvider = new FilePathProvider();

  const uploadFilesRepository = new UploadFilesRepository();
  const uploadFilesUseCase = new UploadFilesUseCase(uploadFilesRepository);

  const uploadFileProvider = new UploadFileProvider(
    hashNameFileProvider,
    filePahtProvider,
    uploadFilesUseCase,
  );

  return new UploadFilesController(uploadFileProvider);
};

export { makeUploadFilesController };
