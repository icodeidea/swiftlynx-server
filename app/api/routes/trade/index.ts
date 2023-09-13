import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { TradeController } from '../../controllers'

const { getTrades, filterTrades, startTrade } = TradeController;

const tradeRouter = Router();

export default (app: Router): Router => {
  app.use('/trade', tradeRouter);

  //start trade
  tradeRouter.route('/start-trade').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.startTrade, startTrade);

  //list trades
  tradeRouter.route('/list-trade').get(middlewares.isAuth, middlewares.attachCurrentUser, getTrades);

  //filter trades
  tradeRouter.route('/filter-trades/:status').get(filterTrades);

  return app;
};
