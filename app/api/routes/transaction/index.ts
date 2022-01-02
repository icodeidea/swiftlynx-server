import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { TransactionController } from '../../controllers'

const { getTransactions } = TransactionController;

const transactionRouter = Router();

export default (app: Router): Router => {
  app.use('/transaction', transactionRouter);

  //get transactions
  transactionRouter.route('/list').get(middlewares.isAuth, middlewares.attachCurrentUser, getTransactions);

  return app;
};
