import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { AuthService } from '../../../services';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import config from '../../../config';
import { Console } from 'winston/lib/winston/transports';

export const renewRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  const logger: Logger = Container.get('logger');
  try {
    logger.debug('Getting refresh token...');
    //const token = req.cookies['user-id'];
    const token = req.get('reftoken');
    console.log(token);
    const authServiceInstance = Container.get(AuthService);
    const { clientTokenVersion, tokenVersion, user } = await authServiceInstance.decodeRefreshToken({ token });
    if (tokenVersion !== clientTokenVersion) {
      logger.debug(' Client token previously revoked, stopping execution...');
      res.clearCookie('user-id');
      return res
        .status(400)
        .send({ success: false, data: {}, message: 'Token is no longer valid, please sign in again' });
    }
    logger.debug('Renewing tokens for user: %s', user._id);
    const { accessToken, refreshToken } = await authServiceInstance.RenewRefreshToken({ user });
    res.cookie('user-id', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      secure: config.environment !== 'development',
    });
    return res.status(200).json({
      success: true,
      data: {
        user: req.currentUser,
        token: accessToken,
        refreshToken,
      },
      message: '',
    });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

export const revokeRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  celebrate({
    body: Joi.object({
      verifyPassword: Joi.string().required(),
    }),
  });
  const logger: Logger = Container.get('logger');
  logger.debug('Calling Revoke-Token endpoint with userId: %s', req.currentUser._id);
  try {
    const { verifyPassword } = req.body;
    const authServiceInstance = Container.get(AuthService);
    const result = await authServiceInstance.RevokeRefreshTokens({ verifyPassword, userId: req.currentUser._id });
    res.clearCookie('user-id');
    return res.status(200).json({ success: true, data: {}, message: result });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
