import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { TradeService } from '../../../services';
import { ITrade } from '../../../interfaces/ITrade';
import { getDateOfMonthsFromNow, getDateRange } from "../../../utils"

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
        '6': 12,
        '12': 24
      };

      const dateRange = getDateRange(parseInt(req.body.month))

      const tradeInput = {
        userId: req.currentUser.id,
        projectId: req.currentUser.id,
        contractId: req.currentUser.id,
        type: 'SWIFT_TRADE',
        status: 'PENDING',
        amount: req.body.amount,
        interest: interest[req.body.month],
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        duration: req.body.month
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
      const data = await tradeServiceInstance.filter(req.params.status, req?.query?.user)
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static updateTradeState = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Update Trade with userId');
    try {
      // req.body.userId = req.currentUser.id;
      const tradeServiceInstance = Container.get(TradeService);
      const data = await tradeServiceInstance.updateTradeStatus({ tradeId: req.body.tradeId, state: req.body.state });
      return res.status(201).json({ success: true, data, message: 'trade updated successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


}
