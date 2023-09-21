import { Router } from 'express';
import middlewares, { validator } from '../../middlewares';
import { UserController } from '../../controllers';

const userRouter = Router();

export default (app: Router): Router => {
  app.use('/user', userRouter);

  userRouter.route('/').get(middlewares.isAuth, middlewares.attachCurrentUser, UserController.getAccount);

  //update-account
  userRouter.route('/update-profile').put(validator.updateUser, middlewares.isAuth, middlewares.attachCurrentUser, UserController.updateAccount);

  //user kpi
  userRouter.route('/kpi').get(middlewares.isAuth, middlewares.attachCurrentUser, UserController.getUserKpi);

  //filter accounts
  userRouter.route('/filter-accounts').get(UserController.filterAccounts);

  //update-password
  userRouter.route('/update-password').put(validator.updatePassword, middlewares.isAuth, middlewares.attachCurrentUser, UserController.UpdatePassword);

  //delete-account
  userRouter.route('/delete-account').post(middlewares.isAuth, middlewares.attachCurrentUser, UserController.deleteAccount);

  return app;
};