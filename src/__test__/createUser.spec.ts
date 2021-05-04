import request from 'supertest';
import { Connection } from 'typeorm';

import app from '@shared/infra/config/app';
import { openConnection } from '@shared/infra/typeorm';
import SendmailProvider from '@shared/providers/SendMailProvider/EtherealMailProvider';

let connection: Connection;
describe('Create User', () => {
  beforeAll(async () => {
    connection = await openConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a user with valid values', async () => {
    jest
      .spyOn(SendmailProvider, 'sendMail')
      .mockReturnValueOnce(Promise.resolve());

    const response = await request(app).post('/user').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
      cpf: '48865917016',
      cep: '01310100',
      homeNumber: 70,
    });

    expect(response.body).toHaveProperty('id');
  });

  it('Should not be able to create a user with invalid cpf', async () => {
    const response = await request(app).post('/user').send({
      name: 'John Doe',
      email: 'john@mail.com',
      password: '123456',
      cpf: 'invalid_cpf',
      cep: '14806349',
      homeNumber: 70,
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe('{"statusCode":400,"message":"Invalid CPF"}');
  });

  it('Should not be able to create a user with invalid cep', async () => {
    const response = await request(app).post('/user').send({
      name: 'John Doe',
      email: 'johnddoe@mail.com',
      password: '123456',
      cpf: '48865917016',
      cep: 'invalid_cep',
      homeNumber: 70,
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      '{"statusCode":400,"message":"Invalid CEP number!"}',
    );
  });

  it('Should not be able to create a user with email already in use', async () => {
    const response = await request(app).post('/user').send({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456',
      cpf: '48865917016',
      cep: '01310100',
      homeNumber: 70,
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      '{"statusCode":400,"message":"E-mail already in use"}',
    );
  });
});
