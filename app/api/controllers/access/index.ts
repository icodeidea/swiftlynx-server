import { Container } from 'typedi';
import { AccessService } from '../../../services';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

export const createAccess = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Create api-key endpoint by user: %s', req.currentUser.email);

  try {
    const accessServiceInstance = Container.get(AccessService);
    const apiKey = await accessServiceInstance.createAPIKey({
      plan: 'BASIC',
      user: req.currentUser.id,
      name: req.body.name,
    });
    return res.status(201).json({ success: true, data: apiKey, message: '' });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

export const getUserAPIKeys = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling get user API: %s', req.currentUser.email);
  try {
    const accessServiceInstance = Container.get(AccessService);
    const apiKey = await accessServiceInstance.listUserAPI({ user: req.currentUser.id });
    return res.status(200).json({ success: true, data: apiKey, message: '' });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
