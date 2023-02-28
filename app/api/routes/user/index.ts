import { Router } from 'express';
import middlewares, { validator } from '../../middlewares';
import { UserController } from '../../controllers';

const userRouter = Router();

export default (app: Router): Router => {
  app.use('/user', userRouter);

  userRouter.route('/').get(middlewares.isAuth, middlewares.attachCurrentUser, UserController.getAccount);

  //update-account
  userRouter.route('/update-account').post(validator.updateUser, middlewares.isAuth, middlewares.attachCurrentUser, UserController.updateAccount);

  //delete-account
  userRouter.route('/delete-account').post(middlewares.isAuth, middlewares.attachCurrentUser, UserController.deleteAccount);

  return app;
};