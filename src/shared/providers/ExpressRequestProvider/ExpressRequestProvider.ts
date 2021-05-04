/* eslint-disable @typescript-eslint/no-empty-interface */
import express, { Request, Response, NextFunction, Router } from 'express';

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
