import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { MarketService } from '../../../services';
import { IMarket, IMarketInputDTO } from '../../../interfaces/';

export class MarketController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static addMarket = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling add market endpoint');
    try {
      const marketServiceInstance = Container.get(MarketService);
      const data = await marketServiceInstance.addMarket(req.body as IMarketInputDTO);
      return res.status(201).json({ success: true, data, message: 'market added successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getMarket = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get market endpoint');
    try {
      const marketId = req.query.marketName || null;
      const marketServiceInstance = Container.get(MarketService);
      const data = await marketServiceInstance.getMarket(marketId);
      return res.status(201).json({ success: true, data, message: 'market retrived successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


}
