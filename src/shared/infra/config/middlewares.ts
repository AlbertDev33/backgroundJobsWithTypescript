import 'reflect-metadata';
import 'dotenv/config';

import express, { Express } from 'express';
import 'express-async-errors';

import { AppError } from '@shared/errors/AppError';
import {
  INextFunction,
  IRequest,
  IResponse,
} from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';

import { router } from '../http/routes';

export default (app: Express): void => {
  app.use(express.json());
  app.use(router);

  app.use(
    async (
      err: Error,
      _: IRequest,
      response: IResponse,
      next: INextFunction,
    ) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          statusCode: err.statusCode,
          message: err.message,
        });
      }

      return response.status(500).json({
        statusCode: '500',
        message: `Internal server error: ${err.message}`,
      });
    },
  );
};
