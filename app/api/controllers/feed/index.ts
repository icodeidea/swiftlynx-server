import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { FeedService, ActivityService } from '../../../services';
import { IFeedInputDTO } from '../../../interfaces/IFeed';

export class FeedController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static write = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling write endpoint');
    try {
      const feedServiceInstance = Container.get(FeedService);
      const message = await feedServiceInstance.Write(req.body as IFeedInputDTO, req.currentUser.id);
      return res.status(201).json({ success: true, data: [], message: 'content created' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static read = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling read endpoint');
    try {
      const { slug } = req.query;
      const feedServiceInstance = Container.get(FeedService);
      const data = await feedServiceInstance.Read(slug || false);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getFeedStackedData = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling getFeedStackedData endpoint');
    try {
      const { slug } = req.query;
      const feedServiceInstance = Container.get(FeedService);
      const activityServiceInstance = Container.get(ActivityService);
      const latest = await feedServiceInstance.Read(slug || false);
      const activity = await activityServiceInstance.recentActivity();
      return res.status(201).json({ success: true, data: { latest, activity }, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static addReaction = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling add reaction endpoint');
    try {
      const feedServiceInstance = Container.get(FeedService);
      const data = await feedServiceInstance.AddReaction(req.body.feed, req.currentUser.id);
      return res.status(201).json({ success: true, data, message: 'data retrived'});
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling write endpoint');
    try {
      const feedId = req.params.id;
      const feedServiceInstance = Container.get(FeedService);
      const message = await feedServiceInstance.Update(req.body as IFeedInputDTO, feedId);
      return res.status(201).json({ success: true, data: [], message: 'content created' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static deleteFeed = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling delete endpoint');
    try {
      const feedId = req.params.id;
      const feedServiceInstance = Container.get(FeedService);
      const data = await feedServiceInstance.Delete({feedId});
      return res.status(200).json({ success: true, data, message: data });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

}
