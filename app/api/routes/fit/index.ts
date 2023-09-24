import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { FitController } from '../../controllers'

const { updateFitState, createFit, filterFits } = FitController;

const fitRouter = Router();

export default (app: Router): Router => {
  app.use('/fit', fitRouter);

  //create fit
  fitRouter.route('/create').post(createFit);

  //filter fits
  fitRouter.route('/filter/:status').get(filterFits);

  //update fit state
  fitRouter.route('/update-state').put(updateFitState);

  return app;
};
