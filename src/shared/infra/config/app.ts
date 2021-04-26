import express from 'express';

import createConnection from '@shared/infra/typeorm';

import setupMiddlewares from './middlewares';

createConnection();
const app = express();
setupMiddlewares(app);

export default app;
