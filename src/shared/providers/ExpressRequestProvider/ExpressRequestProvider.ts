/* eslint-disable @typescript-eslint/no-empty-interface */
import express, { Request, Response, NextFunction, Router } from 'express';

import { IExpressRequestProvider } from './protocol/IExpressRequestProvider';

export interface IRequest extends Request {
  user: {
    id: string;
  };
}

export interface IResponse extends Response {}

export interface INextFunction extends NextFunction {}

export interface IRouter extends Router {}

export const Route = (): IRouter => {
  const router = express.Router();

  return router;
};

export class ExpressRequestProvider implements IExpressRequestProvider {
  async handle(
    request: IRequest,
    response: IResponse,
  ): Promise<IRequest | IResponse> {
    return request && response;
  }
}
