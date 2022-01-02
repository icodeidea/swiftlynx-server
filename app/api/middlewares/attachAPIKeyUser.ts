import { Container } from 'typedi';
import { Logger } from 'winston';
import { AccessService } from '../../services';
import { NextFunction } from 'express';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const attachAPIKeyUser = async (req, res, next): Promise<NextFunction> => {
  const Logger: Logger = Container.get('logger');
  try {
    const accessServiceInstance = Container.get(AccessService);
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ success: false, data: {}, message: 'You need valid api in the request header' });
    }
    const isValidAPIKey = await accessServiceInstance.checkAPIKeys({ apiKey, user: req.currentUser.id });
    if (!isValidAPIKey) {
      return res.status(401).json({ success: false, data: {}, message: 'You need valid api in the request header' });
    }
    const user = await accessServiceInstance.getAPIKeyUser({ apiKey });
    req.currentUser = user;
    req.apiKey = apiKey;
    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachAPIKeyUser;
