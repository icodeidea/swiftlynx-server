/**
 *  MOTIVATION
 *  This is to attach check a user request if token or API key is calling the endpoint
 * reason for this is that we have APIs that are to be consumed by both platform and also can be interacted with API
 * as well
 * ======================
 * Once we setup rateLimit for API call access the beauty of this will be shown
 */

import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { AccessService } from '../../services';
import { Logger } from 'winston';
import { NextFunction } from 'express';
import { IWallet } from '../../interfaces';
import { verify } from 'jsonwebtoken';
import config from '../../config';

class AttachUser {
  attachAPIKeyUser = async (req, res, next): Promise<NextFunction> => {
    const Logger: Logger = Container.get('logger');
    try {
      const accessServiceInstance = Container.get(AccessService);
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) {
        return res.status(401).json({ success: false, data: {}, message: 'You need valid api in the request header' });
      }
      const isValidAPIKey = await accessServiceInstance.checkPlatformAPIKeyValidity({ apiKey });
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

  attachCurrentUser = async (req, res, next): Promise<NextFunction> => {
    const Logger: Logger = Container.get('logger');
    try {
      await this.isValidToken(req);
      const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
      const userRecord = await UserModel.findById(req.token._id);
      if (!userRecord) {
        return res.sendStatus(401);
      }
      const currentUser = userRecord.toJSON();
      req.currentUser = currentUser;
      return next();
    } catch (e) {
      Logger.error('🔥 Error attaching user to req: %o', e);
      return next(e);
    }
  };

  attachUserByTokenOrApi = async (req, res, next): Promise<NextFunction> => {
    const Logger: Logger = Container.get('logger');
    try {
      const apiKeyHeader = req.headers['x-api-key'];
      if (apiKeyHeader) {
        return await this.attachAPIKeyUser(req, res, next);
      } else {
        const checkJWT = await this.isValidToken(req);
        if (!checkJWT) return res.sendStatus(401);
        const walletModel = Container.get('walletModel') as mongoose.Model<IWallet & mongoose.Document>;
        const { user } = await walletModel.findOne({ user: req.token._id });
        if (user) return await this.attachCurrentUser(req, res, next);
        else
          res.status(401).json({
            success: false,
            message: 'wallet setup not completed, goto https://BeeNg.com to finish wallet setup',
          });
      }
    } catch (e) {
      Logger.error('🔥 Error attaching user to req: %o', e);
      return next(e);
    }
  };

  private getCurrentUser = async (token: string) => {
    const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    const userRecord = await UserModel.findById(token);
    return userRecord;
  };

  // private checkJWTHeader = async () => {
  //   // const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
  //   // const userRecord = await UserModel.findById();
  //   // return userRecord;
  // };

  private isValidToken = req => {
    const token = req.get('authorization');
    if (!token) {
      return false;
    }
    const bearer = token.substring(7);
    const decoded = this.decodedToken(bearer);
    req.token._id = decoded._id;
    return true;
  };

  private decodedToken = (token: string) => verify(token, config.jwtSecret);
}

const attachUser = new AttachUser();
export default attachUser;
