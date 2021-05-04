import { FilePathProvider } from '@shared/providers/FilePathProvider/FilePathProvider';

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadFolder: string;

  config: {
    aws: {
      bucket: string;
    };
  };
}

const filePathProvider = new FilePathProvider();
const tmpFolder = filePathProvider.resolve(__dirname, '..', '..', 'tmp');
const uploadFolder = filePathProvider.resolve(tmpFolder, 'uploads');

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadFolder,

  config: {
    aws: {
      bucket: 'app-ticket',
    },
  },
} as IUploadConfig;
