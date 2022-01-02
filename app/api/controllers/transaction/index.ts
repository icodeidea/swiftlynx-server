import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { TransactionService } from '../../../services';
import { ITransaction } from '../../../interfaces/ITransaction';

export class TransactionController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get transactions endpoint');
    try {
      const transactionServiceInstance = Container.get(TransactionService);
      const data = await transactionServiceInstance.getTransactions(req.currentUser.id);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


}
