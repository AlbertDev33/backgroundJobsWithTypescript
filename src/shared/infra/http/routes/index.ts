import { userRouter } from '@modules/users/infra/http/routes/users.routes';
import { Route } from '@shared/providers/ExpressRequestProvider/ExpressRequestProvider';

export const router = Route();

router.use('/user', userRouter);
