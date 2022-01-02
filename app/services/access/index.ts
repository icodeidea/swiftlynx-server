import { Service, Inject } from 'typedi';
// import MailerService from './mailer';
import { randomBytes } from 'crypto';
import { IAPIKey } from '../../interfaces/IAPIKey';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
// import events from '../../subscribers/events';
import { SystemError } from '../../utils';
import { Document, Error } from 'mongoose';
import { IUser } from '../../interfaces';

@Service()
export class AccessService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('apiKeyModel') private apiKeyModel: Models.APIKeyModel,
    // private mailer: MailerService,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createAPIKey({
    plan,
    user,
    name,
  }: {
    plan?: 'BASIC' | 'PRO' | 'ENTERPRISE' | 'PROMO';
    user: string;
    name: string;
  }): Promise<string> {
    try {
      this.logger.silly('Generating API Key...');
      const userAPIKeys: IAPIKey & Document = await this.apiKeyModel.findOne({ user });
      const newAPIKey = `KW_${this.generateRandomString()}`;
      const data = {
        key: newAPIKey,
        name,
        account: user,
      };
      if (!userAPIKeys) {
        await this.apiKeyModel.create({
          apis: [data],
          user,
          plan: plan || 'BASIC',
        });
      } else {
        const checkName = this.checkIfAPINameExists(userAPIKeys.apis, name);
        if (checkName) throw new SystemError(200, 'API key name already exists');
        //limit API create
        //TODO set to DB env
        if (userAPIKeys.apis.length >= 5) throw new SystemError(200, 'create API limit reached, you can oly create 5 apis');
        await userAPIKeys.apis.push(data);
        await userAPIKeys.save();
      }
      return newAPIKey;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async checkAPIKeys({ apiKey, user }: { apiKey: string; user: string }): Promise<boolean> {
    this.logger.silly('Decrypting SecretKey...');
    try {
      const userAPI: IAPIKey & Document = await this.apiKeyModel.findOne({ user });
      if (!userAPI) return false;
      const checkAPI = userAPI.apis.find(access => access.key === apiKey);
      if (!checkAPI) return false;
      return true;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async checkPlatformAPIKeyValidity({ apiKey }: { apiKey: string }): Promise<boolean> {
    this.logger.silly('Decrypting SecretKey...');
    try {
      const userAPI: IAPIKey & Document = await this.apiKeyModel.findOne({ apis: { $elemMatch: { key: apiKey } } });
      console.log(userAPI);
      if (!userAPI) return false;
      // const checkAPI = userAPI.apis.find(access => access.key === apiKey);
      // if (!checkAPI) return false;
      return true;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getAPIKeyUser({ apiKey }: { apiKey: string }): Promise<IUser & Document> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    try {
      const getAPI: IAPIKey & Document = await this.apiKeyModel.findOne({ apis: { $elemMatch: { key: apiKey } } });
      console.log('this is it', getAPI);
      const user = await this.userModel.findById(getAPI.user);
      return user;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async identifyAPIForLimiter({
    providedKey,
  }: {
    providedKey: string;
  }): Promise<{ plan?: string; active?: boolean }> {
    this.logger.silly('Decrypting Identifying APIKey...');
    try {
      const apiKeys: IAPIKey & Document = await this.apiKeyModel.findOne({ key: providedKey });
      const { active } = apiKeys.apis[0];
      return { active };
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async listUserAPI({ user }: { user: string }): Promise<IAPIKey['apis']> {
    this.logger.silly('Listing User API Keys');
    try {
      const apiKeys = await this.apiKeyModel.findOne({ user });
      if (!apiKeys) throw new SystemError(200, 'you have not created any APIs');
      // delete apiKeys.
      return apiKeys['apis'];
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  private generateRandomString() {
    return randomBytes(21).toString('hex');
  }

  private checkIfAPINameExists(api: IAPIKey['apis'], name: string) {
    const checkAPI = api.find(access => access.name === name);
    if (checkAPI) return true;
    return false;
  }
}
