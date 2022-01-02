import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { AuthService } from '../../../services';
import { Logger } from 'winston';


export class UserController {

    static updateAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling Update Account with userId: %s', req.currentUser.id);
        try {
          const authServiceInstance = Container.get(AuthService);
          const result = await authServiceInstance.UpdateRecord({ updateRecord: req.body, userId: req.currentUser.id });
          return res.status(200).json({ success: true, data: result, message: 'user updated successfully' });
        } catch (e) {
          logger.error('🔥 error: %o', e);
          return next(e);
        }
    };

    static deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling Delete Account with userId: %s', req.currentUser.id);
        try {
          const authServiceInstance = Container.get(AuthService);
          const result = await authServiceInstance.DeleteUser({ userId: req.currentUser.id });
          return res.status(200).json({ success: true, data: {}, message: result });
        } catch (e) {
          logger.error('🔥 error: %o', e);
          return next(e);
        }
      };

}
