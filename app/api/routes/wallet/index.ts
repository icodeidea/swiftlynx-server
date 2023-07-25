import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { WalletController } from '../../controllers'

const { 
  getWalletInfo, 
  activateWallet, 
  WithdrawFund, 
  getAllPayout, 
  RequestPayout,
  getPayoutAccountDetails,
  AddPayoutAccountDetail,
  DeleteAccountDetail ,
  getSwiftlynxAccountDetails
} = WalletController;

const walletRouter = Router();

export default (app: Router): Router => {
  app.use('/wallet', walletRouter);

  //get wallet info
  walletRouter.route('/info').get(middlewares.isAuth, middlewares.attachCurrentUser, getWalletInfo);

  //activate wallet
  walletRouter.route('/activate').post(validator.walletActivation, middlewares.isAuth, middlewares.attachCurrentUser, activateWallet);

  //withdraw  fund
  walletRouter.route('/withdraw-fund').post(validator.withdrawFund, middlewares.isAuth, middlewares.attachCurrentUser, WithdrawFund);

  //get all payouts
  walletRouter.route('/all-payout').get(middlewares.isAuth, middlewares.attachCurrentUser, getAllPayout);

    //get all payouts
    walletRouter.route('/payback-accounts').get(getSwiftlynxAccountDetails);

  //request payout
  walletRouter.route('/request-payout').post(validator.requestPayout, middlewares.isAuth, middlewares.attachCurrentUser, RequestPayout);

  //get all payout account detail
  walletRouter.route('/all-payout-account-details').get(middlewares.isAuth, middlewares.attachCurrentUser, getPayoutAccountDetails);

  //add payout account detail
  walletRouter.route('/add-payout-account-detail').post(validator.addPayoutAccountDetail, middlewares.isAuth, middlewares.attachCurrentUser, AddPayoutAccountDetail);

  //delete payout account detail
  walletRouter.route('/delete-payout-account-detail').delete(middlewares.isAuth, middlewares.attachCurrentUser, validator.deletePayoutAccountDetail, DeleteAccountDetail);

  return app;
};
