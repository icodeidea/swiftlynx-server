import { Container } from 'typedi';
import mongoose from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { Logger } from 'winston';
import { NextFunction } from 'express';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const isAdmin = async (req, res, next): Promise<NextFunction> => {
  const Logger: Logger = Container.get('logger');
  try {
    const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    const userRecord = await UserModel.findById(req.token._id);
    if (!userRecord) {
      return res.sendStatus(401);
    }
    const currentUser = userRecord.toJSON();
    req.isAdmin = currentUser.role === 'MANAGER' ? true : false;

    if (!req.isAdmin) {
        return res.sendStatus(401);
    }

    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default isAdmin;
