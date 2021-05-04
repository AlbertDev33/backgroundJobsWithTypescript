import express from 'express';

import { openConnection } from '@shared/infra/typeorm';

import setupMiddlewares from './middlewares';

openConnection();
const app = express();
setupMiddlewares(app);

export default app;
