import 'reflect-metadata';
import 'dotenv/config';

import express, { Express } from 'express';
import 'express-async-errors';

import { router } from '../http/routes';

export default (app: Express): void => {
  app.use(express.json());
  app.use(router);
};
