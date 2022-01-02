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
}
