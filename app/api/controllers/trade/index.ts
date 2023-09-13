import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { TradeService } from '../../../services';
import { ITrade } from '../../../interfaces/ITrade';
import { getDateOfMonthsFromNow } from "../../../utils"

export class TradeController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getTrades = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get trades endpoint');
    try {
      const entityId = req.currentUser.id;
      console.log(entityId);
      const tradeServiceInstance = Container.get(TradeService);
      const data = await tradeServiceInstance.getTrades(entityId);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static startTrade = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling start trade endpoint');
    try {

      const interest = {
        '6': 10,
        '12': 15
      };

      const tradeInput = {
        userId: req.currentUser.id,
        projectId: req.currentUser.id,
        contractId: req.currentUser.id,
        type: 'SWIFT_TRADE',
        status: 'PENDING',
        amount: req.body.amount,
        interest: interest[req.body.month],
        startDate: new Date(),
        endDate: getDateOfMonthsFromNow(req.body.month),
      };
      const tradeServiceInstance = Container.get(TradeService);
      const data = await tradeServiceInstance.startTrade(tradeInput);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static filterTrades = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling filter trades endpoint');
    try {
      const tradeServiceInstance = Container.get(TradeService);
      const data = await tradeServiceInstance.filter(req.params.status)
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


}
