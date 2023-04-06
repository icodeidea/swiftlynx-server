import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { TradeService } from '../../../services';
import { ITrade } from '../../../interfaces/ITrade';

export class TradeController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getTrades = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get trades endpoint');
    try {
      const entityId = req.query.entityId || req.currentUser.id;
      const tradeServiceInstance = Container.get(TradeService);
      const data = await tradeServiceInstance.getTrades(entityId);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


}
