import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { CommentService } from '../../../services';
import { ICommentInputDTO } from '../../../interfaces/IComment';

export class CommentController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static write = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling write endpoint');
    try {
      const commentServiceInstance = Container.get(CommentService);
      const data = await commentServiceInstance.Write(req.body as ICommentInputDTO, req.currentUser.id);
      return res.status(201).json({ success: true, data, message: 'comment created' });
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
      const { feed } = req.query;
      const commentServiceInstance = Container.get(CommentService);
      const data = await commentServiceInstance.Read(feed || false);
      console.log(data);
      return res.status(201).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling delete endpoint');
    try {
      const commentId = req.params.id;
      const feedServiceInstance = Container.get(CommentService);
      const data = await feedServiceInstance.Delete({commentId});
      return res.status(200).json({ success: true, data, message: 'data retrived' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

}
