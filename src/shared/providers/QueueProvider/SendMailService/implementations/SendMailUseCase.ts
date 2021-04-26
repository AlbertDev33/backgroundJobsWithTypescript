import path from 'path';

import SendMailDevProvider from '@shared/providers/SendMailProvider/EtherealMailProvider';

import { ISendMailUseCase } from './model/ISendMailUseCase';

export interface ISendMailSource {
  name: string;
  token: string;
  email: string;
}

export class SendMailUseCase implements ISendMailUseCase {
  public key = 'RegistrationMail';

  async execute(data: ISendMailSource): Promise<void> {
    const { name, token, email } = data;

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'SendMailProvider',
      'MailTemplate',
      'confirmUserMail.hbs',
    );

    const variables = {
      name,
      link: `http://localhost:3333/confirmation/confirm?token=${token}`,
    };

    await SendMailDevProvider.sendMail({
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
