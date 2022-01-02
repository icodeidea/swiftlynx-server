import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { WalletController } from '../../controllers'

const { getWalletInfo, activateWallet, WithdrawFund } = WalletController;

const walletRouter = Router();

export default (app: Router): Router => {
  app.use('/wallet', walletRouter);

  //get wallet info
  walletRouter.route('/info').get(middlewares.isAuth, middlewares.attachCurrentUser, getWalletInfo);

  //activate wallet
  walletRouter.route('/activate').post(validator.walletActivation, middlewares.isAuth, middlewares.attachCurrentUser, activateWallet);

  //withdraw  fund
  walletRouter.route('/withdraw-fund').post(validator.withdrawFund, middlewares.isAuth, middlewares.attachCurrentUser, WithdrawFund);

  return app;
};
