import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { WalletService } from '../../../services';
import { IWalletInputDTO } from '../../../interfaces/IWallet';

export class WalletController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getWalletInfo = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get wallet endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.getBalance(req.currentUser.id);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static activateWallet = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get wallet endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.activateWallet(req.currentUser.id, req.body.address);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static WithdrawFund = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling withdraw fund endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.withdrawFund({user: req.currentUser.id, amount: req.body.amount, address: req.body.address});
      return res.status(201).json({ success: true, data, message: 'Transfer Completed' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static getAllPayout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get all payouts endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.getAllPayoutRequest(req.query?.status as string);
      return res.status(201).json({ success: true, data, message: 'get all payout' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static updatePayoutStatus = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Update Payout with userId');
    try {
      // req.body.userId = req.currentUser.id;
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.updatePayoutStatus({ payoutId: req.body.payoutId, state: req.body.state });
      return res.status(201).json({ success: true, data, message: 'payout updated successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static RequestPayout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling request payout endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.payoutRequest({
        user: req.currentUser.id, 
        subject: req.body.entityId, 
        subjectRef: req.body.entity,
        accountDetailId: req.body.accountDetailId
      });
      return res.status(201).json({ success: true, data, message: 'payout request successful' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static getSwiftlynxAccountDetails = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get swiftlynx account endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.getSwiftlynxPaymentDetails();
      return res.status(201).json({ success: true, data, message: 'all account details' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static getPayoutAccountDetails = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get payout account endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.getAccountDetails(req.currentUser.id);
      return res.status(201).json({ success: true, data, message: 'all account details' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static AddPayoutAccountDetail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling add account detail endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.addAccountDetail({
        user: req.currentUser.id, 
        accountName: req.body.accountName, 
        accountNumber: req.body.accountNumber,
        bankname: req.body.bankname
      });
      return res.status(201).json({ success: true, data, message: 'added account detail successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static DeleteAccountDetail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling delete account detail endpoint');
    try {
      const walletServiceInstance = Container.get(WalletService);
      const data = await walletServiceInstance.deleteAccountDetail({
        user: req.currentUser.id, 
        accountDetailId: req.body.accountDetailId
      });
      return res.status(201).json({ success: true, data, message: 'delete account detail successful' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
}
