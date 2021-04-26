/* eslint-disable max-classes-per-file */
import SendMailProvider from '@shared/providers/SendMailProvider/EtherealMailProvider';
import { SESMailProvider } from '@shared/providers/SendMailProvider/SESMailProvider';

import { SendMailUseCase } from './SendMailUseCase';

jest.mock('@shared/providers/SendMailProvider/EtherealMailProvider');
jest.mock('@shared/providers/SendMailProvider/SESMailProvider');

interface ISutTypes {
  sut: SendMailUseCase;
}

const makeSut = (): ISutTypes => {
  const sut = new SendMailUseCase();

  return {
    sut,
  };
};

describe('Send Mail', () => {
  const fakeUser = {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    token: 'valid_token',
  };

  it('Should be able to send a register confirmation mail to user', async () => {
    const { sut } = makeSut();

    const sendFakeMail = jest.spyOn(SendMailProvider, 'sendMail');

    await sut.execute(fakeUser);

    expect(sendFakeMail).toHaveBeenCalled();
  });
});
