import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { MarketController } from '../../controllers'

const { addMarket, getMarket } = MarketController;

const marketRouter = Router();

export default (app: Router): Router => {
  app.use('/market', marketRouter);

  //add market
  marketRouter.route('/add-market').post(middlewares.isAuth, middlewares.isAdmin, middlewares.attachCurrentUser, validator.addMarket, addMarket);

  //list market
  marketRouter.route('/list-market').get(getMarket);

  return app;
};
