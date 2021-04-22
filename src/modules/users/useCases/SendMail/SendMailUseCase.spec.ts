/* eslint-disable max-classes-per-file */
import { IFilePathProvider } from '@shared/providers/FilePathProvider/model/IFilePathProvider';
import {
  ISendMail,
  ISendMailProvider,
} from '@shared/providers/SendMailProvider/protocol/ISendMailProvider';

import { SendMailUseCase } from './SendMailUseCase';

interface ISutTypes {
  sut: SendMailUseCase;
  sendMailProvider: ISendMailProvider;
  filePathProviderStub: IFilePathProvider;
}

const makeFilePathProvider = (): IFilePathProvider => {
  class FilePathProviderStub implements IFilePathProvider {
    resolve(...pathSegments: string[]): string {
      return '';
    }
    basename(filePath: string, ext?: string): string {
      return '';
    }
  }

  return new FilePathProviderStub();
};

const makeSendMailProvider = (): ISendMailProvider => {
  class SendMailProviderStub implements ISendMailProvider {
    async sendMail({ to, subject, variables, path }: ISendMail): Promise<void> {
      const sendMail = {
        to,
        from: 'Equipe de Autenticação!',
        subject,
        html: '',
      };
    }
  }

  return new SendMailProviderStub();
};

const makeSut = (): ISutTypes => {
  const filePathProviderStub = makeFilePathProvider();
  const sendMailProvider = makeSendMailProvider();

  const sut = new SendMailUseCase(filePathProviderStub, sendMailProvider);

  return {
    sut,
    filePathProviderStub,
    sendMailProvider,
  };
};

describe('Send Mail', () => {
  const fakeUser = {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    token: 'valid_token',
  };

  it('Should be able to send a register confirmation mail to user', async () => {
    const { sut, sendMailProvider } = makeSut();

    const sendMail = jest.spyOn(sendMailProvider, 'sendMail');

    await sut.execute(fakeUser);

    expect(sendMail).toHaveBeenCalled();
  });
});
