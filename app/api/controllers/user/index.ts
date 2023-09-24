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

    static updateRole = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling Update Role with userId: %s', req.body.userId);
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.UpdateRecord({ updateRecord: {role: req.body.role}, userId: req.body.userId });
        return res.status(200).json({ success: true, data: result, message: 'user updated successfully' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
  };

    static getAccount = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling Get Account with userId: %s', req.currentUser.id);
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.GetUser({ userId: req.currentUser.id });
        return res.status(200).json({ success: true, data: result, message: 'user found' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    };

    static filterAccounts = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling Get Account with userId');
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.FilterUsers({ key: req?.query?.key, value: req?.query?.value });
        return res.status(200).json({ success: true, data: result, message: 'users found' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    };

    static getUserKpi = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling Get User Kpi with userId: %s', req.currentUser.id);
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.GetUserKpi({ userId: req.currentUser.id });
        return res.status(200).json({ success: true, data: result, message: 'user kpi' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    };

    static UpdatePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling update Account password with userId: %s', req.currentUser.id);
      try {
        const authServiceInstance = Container.get(AuthService);
        const result = await authServiceInstance.AuthedUpdatePassword(req.currentUser.id, req.body.password, req.body.newPassword);
        return res.status(200).json({ success: true, data: result, message: 'user password updated' });
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
