import { IFilePathProvider } from '@shared/providers/FilePathProvider/model/IFilePathProvider';
import SendMailDevProvider from '@shared/providers/SendMailProvider/EtherealMailProvider';
import { ISendMailProvider } from '@shared/providers/SendMailProvider/protocol/ISendMailProvider';
import { SESMailProvider } from '@shared/providers/SendMailProvider/SESMailProvider';

import { ISendMailUseCase } from './model/ISendMailUseCase';

export interface ISendMailSource {
  name: string;
  token: string;
  email: string;
}

export class SendMailUseCase implements ISendMailUseCase {
  constructor(
    private sendMailProvider: ISendMailProvider,

    private filePathProvider: IFilePathProvider,
  ) {}

  get key(): string {
    return 'RegistrationMail';
  }

  async execute(data: ISendMailSource): Promise<void> {
    const { name, token, email } = data;

    const templatePath = this.filePathProvider.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'shared',
      'providers',
      'SendMailProvider',
      'MailTemplate',
      'confirmUserMail.hbs',
    );

    const variables = {
      name,
      link: `http://localhost:3333/user/confirmation?token=${token}`,
    };

    await this.sendMailProvider.sendMail({
      to: {
        name,
        address: email,
      },
      subject: 'Confirmação de Cadastro',
      variables,
      path: templatePath,
    });
  }
}
