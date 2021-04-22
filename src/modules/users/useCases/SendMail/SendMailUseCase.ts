import { IFilePathProvider } from '@shared/providers/FilePathProvider/model/IFilePathProvider';
import { ISendMailProvider } from '@shared/providers/SendMailProvider/protocol/ISendMailProvider';

export interface ISendMailSource {
  name: string;
  token: string;
  email: string;
}

export class SendMailUseCase {
  public key = 'RegistrationMail';

  constructor(
    private filePathProvider: IFilePathProvider,

    private sendMailProvider: ISendMailProvider,
  ) {}

  async execute({ name, token, email }: ISendMailSource): Promise<void> {
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
      link: `http://localhost:3333/confirmation/confirm?token=${token}`,
    };

    await this.sendMailProvider.sendMail({
      to: email,
      subject: 'Confirmação de Cadastro',
      variables,
      path: templatePath,
    });
  }
}
