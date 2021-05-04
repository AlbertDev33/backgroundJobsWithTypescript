import { FilePathProvider } from '@shared/providers/FilePathProvider/FilePathProvider';
import SendMailDevProvider from '@shared/providers/SendMailProvider/EtherealMailProvider';

import { SendMailUseCase } from './SendMailUseCase';

const makeSendMailUseCase = (): SendMailUseCase => {
  const filePathProvider = new FilePathProvider();

  const sendMailUseCase = new SendMailUseCase(
    SendMailDevProvider,
    filePathProvider,
  );

  return sendMailUseCase;
};

export { makeSendMailUseCase };
