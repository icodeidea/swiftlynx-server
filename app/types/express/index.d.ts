import { Document, Model } from 'mongoose';
import { 
  IUser, 
  IAPIKey, 
  IWallet, 
  IFeed, 
  IComment, 
  ITransaction, 
  IActivity,
  IAppSetting,
  ITrade,
  IContract,
  IMarket,
  IProject
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
      export type TradeModel = Model<ITrade & Document>;
      export type ContractModel = Model<IContract & Document>;
      export type MarketModel = Model<IMarket & Document>;
      export type ProjectModel = Model<IProject & Document>;
    }
  }