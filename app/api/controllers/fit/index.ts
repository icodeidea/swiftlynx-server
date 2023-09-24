import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { FitService } from '../../../services';
import { IFit } from '../../../interfaces/IFit';
import { getDateOfMonthsFromNow } from "../../../utils"

export class FitController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static createFit = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling create fit endpoint');
    try {
      const fitServiceInstance = Container.get(FitService);
      const data = await fitServiceInstance.saveFit(req.body);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static filterFits = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling filter fits endpoint');
    try {
      const fitServiceInstance = Container.get(FitService);
      const data = await fitServiceInstance.filter(req.params.status, req?.query?.branch as string)
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  static updateFitState = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Update Fit with userId');
    try {
      // req.body.userId = req.currentUser.id;
      const fitServiceInstance = Container.get(FitService);
      const data = await fitServiceInstance.updateFitStatus({ fitId: req.body.fitId, state: req.body.state });
      return res.status(201).json({ success: true, data, message: 'fit updated successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


}
