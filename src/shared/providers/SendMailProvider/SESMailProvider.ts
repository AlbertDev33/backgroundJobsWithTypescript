import aws from 'aws-sdk';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

import {
  ISendMailProvider,
  ISendMail,
} from '@shared/providers/SendMailProvider/protocol/ISendMailProvider';

export class SESMailProvider implements ISendMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_DEFAULT_REGION,
      }),
    });
  }

  public async sendMail({
    to,
    subject,
    variables,
    path,
  }: ISendMail): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const templateParse = handlebars.compile(templateFileContent);

    const templateHTML = templateParse(variables);

    await this.client.sendMail({
      to: {
        name: to.name,
        address: to.address,
      },
      from: {
        name: 'Equepe de Teste',
        address: 'albert@migrar.cloud',
      },
      subject,
      html: templateHTML,
    });
  }
}
