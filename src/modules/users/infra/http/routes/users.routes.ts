import { makeCreateUserController } from '@modules/users/useCases/CreateUser';
import { makeRegisterConfirmationController } from '@modules/users/useCases/RegisterConfirmation';
import {
  IRequest,
  IResponse,
  Route,
} from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';

const userRouter = Route();

userRouter.post('/', async (request: IRequest, response: IResponse) => {
  await makeCreateUserController().handle(request, response);
});

userRouter.post(
  '/confirmation',
  async (request: IRequest, response: IResponse) => {
    await makeRegisterConfirmationController().handle(request, response);
  },
);

export { userRouter };
