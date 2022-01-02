import { Document, Model } from 'mongoose';
import { 
  IUser, 
  IAPIKey, 
  IWallet, 
  IFeed, 
  IComment, 
  ITransaction, 
  IActivity,
  IAppSetting 
} from '../../interfaces';

declare global {
    namespace Express {
      export interface Request {
        currentUser: IUser & Document;
      }
    }

    namespace Models {
      export type UserModel = Model<IUser & Document>;
      export type WalletModel = Model<IWallet & Document>;
      export type APIKeyModel = Model<IAPIKey & Document>;
      export type FeedModel = Model<IFeed & Document>;
      export type CommentModel = Model<IComment & Document>;
      export type ActivityModel = Model<IActivity & Document>;
      export type TransactionModel = Model<ITransaction & Document>;
      export type AppSettingModel = Model<IAppSetting & Document>;
    }
  }