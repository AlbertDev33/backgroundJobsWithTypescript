import { makeCreateUserController } from '@modules/users/useCases/CreateUser';
import { makeRegisterConfirmationController } from '@modules/users/useCases/RegisterConfirmation';
import { makeUploadFilesController } from '@modules/users/useCases/UploadFiles';
import { makeSessionController } from '@modules/users/useCases/UserSession';
import {
  IRequest,
  IResponse,
  Route,
} from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';

const userRouter = Route();

userRouter.post('/', async (request: IRequest, response: IResponse) => {
  await makeCreateUserController().handle(request, response);
});

userRouter.get(
  '/confirmation',
  async (request: IRequest, response: IResponse) => {
    await makeRegisterConfirmationController().handle(request, response);
  },
);

userRouter.post('/session', async (request: IRequest, response: IResponse) => {
  await makeSessionController().handle(request, response);
});

userRouter.post('/upload', async (request: IRequest, response: IResponse) => {
  await makeUploadFilesController().handle(request, response);
});

export { userRouter };
