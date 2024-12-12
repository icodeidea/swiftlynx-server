import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { AuthService } from '../../../services';
import { IUserInputDTO } from '../../../interfaces/IUser';
import { Logger } from 'winston';
import config from '../../../config';

export class AuthController {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static signup = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
    try {
      const authServiceInstance = Container.get(AuthService);
      const message = await authServiceInstance.SignUp(req.body as IUserInputDTO);
      return res.status(201).json({ success: true, data: {}, message: 'sign up successful' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static signin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Sign-In endpoint with body: %o', req.body);
    try {
      const { email, password } = req.body;
      const authServiceInstance = Container.get(AuthService);
      const { user, accessToken, refreshToken, wallet } = await authServiceInstance.SignIn({ email, password });

      res.cookie('user-id', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: config.environment !== 'development',
      });
      return res
        .status(200)
        .json({ success: true, data: { user, token: accessToken, refreshToken, wallet }, message: '' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Google Auth endpoint with body: %o', req.body);
    try {
      const referer = req.query.ref || false;
      if(referer) req.body.refCode = referer;
      const authServiceInstance = Container.get(AuthService);
      const { user, accessToken, refreshToken, wallet } = await authServiceInstance.GoogleAuth(req.body);
      res.cookie('user-id', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: config.environment !== 'development',
      });
      return res
        .status(200)
        .json({ success: true, data: { user, token: accessToken, refreshToken, wallet }, message: '' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static signout = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    try {
      res.clearCookie('user-id');
      return res
        .status(200)
        .json({ success: true, data: {}, message: 'You have successfully signed out. See you again soon' });
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  };

  static verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('verifying: %s', req.params.token);
    try {
      console.log(req);
      const authServiceInstance = Container.get(AuthService);

      const { user, accessToken, refreshToken, wallet } = await authServiceInstance.VerifyMail({ 
        token: req.params.token, 
        email: req.params.email,
        type: req.params.type
      });

      res.cookie('user-id', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        secure: config.environment !== 'development',
      });
      return res
        .status(200)
        .json({ success: true, data: { user, token: accessToken, refreshToken, wallet }, message: "Your email has now been verified. Thank you for using our service" });
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  };

  static async resendVerification(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const logger: Logger = Container.get('logger');
    logger.debug('verifying: %s', req.params.token);
    try {
      const authServiceInstance = Container.get(AuthService);

      const result = await authServiceInstance.ResendVerification({ userId: req.currentUser.id });
      return res.status(201).json({ success: true, data: {}, message: result });
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  }

  static resendVerificationMail = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('verifying: %s', req.body.email);
    logger.debug('resending: %s', req.params.type);
    try {
      const authServiceInstance = Container.get(AuthService);

      const result = await authServiceInstance.ResendVerificationMail(req.body.email, req.params.type);
      return res.status(201).json({ success: true, data: {}, message: result });
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  };

  static requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    try {
      const authServiceInstance = Container.get(AuthService);
      const result = await authServiceInstance.RequestPasswordReset(req.body.email);
      return res.status(201).json({ success: true, data: {}, message: result });
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  };

  static updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    try {
      const token = req.params.token;
      const authServiceInstance = Container.get(AuthService);
      const result = await authServiceInstance.UpdatePassword(token, req.body.password);
      return res.status(201).json({ success: true, data: {}, message: result });
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  };

  static authedUpdatePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    try {
      const {current, password} = req.body;
      const authServiceInstance = Container.get(AuthService);
      const result = await authServiceInstance.AuthedUpdatePassword(req.currentUser.id, current, password);
      return res.status(201).json({ success: true, data: {}, message: result });
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  };

}