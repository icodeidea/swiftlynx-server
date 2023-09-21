import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { SafeController } from '../../controllers'

const { listMySafe, createSafe, filterSavings, updateSafeState } = SafeController;

const safeRouter = Router();

export default (app: Router): Router => {
  app.use('/safe', safeRouter);

  //get safe list
  safeRouter.route('/list-safe').get(middlewares.isAuth, middlewares.attachCurrentUser, listMySafe);

  //filter contracts
  safeRouter.route('/filter-savings/:status').get(filterSavings);

  //create safe
  safeRouter.route('/create-safe').post(validator.createSafe, middlewares.isAuth, middlewares.attachCurrentUser, createSafe);

  //update safe state
  safeRouter.route('/update-state').put(validator.updateSafe, updateSafeState);

  return app;
};
