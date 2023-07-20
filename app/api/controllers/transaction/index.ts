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

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static getEntityTransactions = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling get transactions endpoint');
      try {
        const transactionServiceInstance = Container.get(TransactionService);
        const data = await transactionServiceInstance.getEntityTransactions(req.query.entityId as string);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    };

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static initPayment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling post initialise payment endpoint');
      try {
        const transactionServiceInstance = Container.get(TransactionService);
        const data = await transactionServiceInstance.initialisePayment(req?.currentUser?.id, req.body.amount, req.body.entity, req.body.entityId);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    };

        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        static paymentCallback = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
          const logger: Logger = Container.get('logger');
          logger.debug('Calling verify payment endpoint');
          const ref = req?.query?.reference || null
          try {
            const transactionServiceInstance = Container.get(TransactionService);
            const data = await transactionServiceInstance.verifyPayment(ref);
            return res.status(201).json({ success: true, data, message: 'data retrived' });
          } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
          }
        };


}
