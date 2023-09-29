import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { SafeService } from '../../../services';
import { ISafeInputDTO } from '../../../interfaces/ISafe';

export class SafeController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static listMySafe = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get safe endpoint');
    try {
      const safeServiceInstance = Container.get(SafeService);
      const data = await safeServiceInstance.list(req.currentUser.id);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static filterSavings = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling filter savings endpoint');
    try {
      const safeServiceInstance = Container.get(SafeService);
      const data = await safeServiceInstance.filter(req.params.status, req?.query?.user)
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static createSafe = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling create safe endpoint');
    try {
      const safeServiceInstance = Container.get(SafeService);
      const data = await safeServiceInstance.startSavings(req.body, req.currentUser.id);
      return res.status(201).json({ success: true, data, message: 'safe created' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static updateSafeState = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Update Safe with userId');
    try {
      // req.body.userId = req.currentUser.id;
      const safeServiceInstance = Container.get(SafeService);
      const data = await safeServiceInstance.updateSafeStatus({ safeId: req.body.safeId, state: req.body.state });
      return res.status(201).json({ success: true, data, message: 'safe updated successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

//   static WithdrawFund = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
//     const logger: Logger = Container.get('logger');
//     logger.debug('Calling withdraw fund endpoint');
//     try {
//       const walletServiceInstance = Container.get(WalletService);
//       const data = await walletServiceInstance.withdrawFund({user: req.currentUser.id, amount: req.body.amount, address: req.body.address});
//       return res.status(201).json({ success: true, data, message: 'Transfer Completed' });
//     } catch (e) {
//       logger.error('🔥 error: %o', e);
//       return next(e);
//     }
//   };
}
