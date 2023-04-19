import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { SafeController } from '../../controllers'

const { listMySafe, createSafe } = SafeController;

const safeRouter = Router();

export default (app: Router): Router => {
  app.use('/safe', safeRouter);

  //get safe list
  safeRouter.route('/list-safe').get(middlewares.isAuth, middlewares.attachCurrentUser, listMySafe);

  //create safe
  safeRouter.route('/create-safe').post(validator.createSafe, middlewares.isAuth, middlewares.attachCurrentUser, createSafe);

  return app;
};
