import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { TransactionController } from '../../controllers'

const { getTransactions, getEntityTransactions, initPayment, paymentCallback } = TransactionController;

const transactionRouter = Router();

export default (app: Router): Router => {
  app.use('/transaction', transactionRouter);

  //get transactions
  transactionRouter.route('/list').get(middlewares.isAuth, middlewares.attachCurrentUser, getTransactions);

  transactionRouter.route('/list-entity-tnx').get(middlewares.isAuth, middlewares.attachCurrentUser, getEntityTransactions);

  transactionRouter.route('/initialise-payment').post(validator.initPayment, middlewares.isAuth, middlewares.attachCurrentUser, initPayment);

  transactionRouter.route('/payment-callback').get(paymentCallback);

  return app;
};
