import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { TradeController } from '../../controllers'

const { getTrades } = TradeController;

const tradeRouter = Router();

export default (app: Router): Router => {
  app.use('/trade', tradeRouter);

  //list trades
  tradeRouter.route('/list-trade').get(middlewares.isAuth, middlewares.attachCurrentUser, getTrades);

  return app;
};
