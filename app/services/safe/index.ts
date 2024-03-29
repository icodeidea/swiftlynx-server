import { Service, Inject } from 'typedi';
import { Document, Types } from 'mongoose';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
import { ITransactionInputDTO, ISafeInputDTO, ISafe, ITransaction, IWallet, IUser } from '../../interfaces';
import { Console } from 'winston/lib/winston/transports';
import { TransactionService } from '../transaction';
import { AuthService } from '../auth';
import { SystemError } from '../../utils';
import * as EtheriumTransactionHelper from '../../drivers/etherium/bscScan/module/transaction';
import * as ether from '../../drivers/etherium/ethers/module/transaction';
import * as web3 from '../../drivers/etherium/web3/module/transaction';
import { any } from 'joi';

@Service()
export class SafeService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('walletModel') private walletModel: Models.WalletModel,
    @Inject('safeModel') private safeModel: Models.SafeModel,
    private transactor: TransactionService,
    private userAccount: AuthService,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async startSavings(data: ISafeInputDTO, userId: string): Promise<ISafe> {
    try {
      return await this.safeModel.create({
        user: userId,
        remark: data.remark,
        goal: data.goal
      });
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async list(userId: string, safeId?: string): Promise<any> {
    try {
      this.logger.silly('getting savings record');

      if(!safeId || safeId === null) return await this.safeModel.find({user: userId}).sort({createdAt: -1});

      if(safeId) return await this.safeModel.find({_id: safeId}).sort({createdAt: -1});
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async filter(status: string, user?: any): Promise<any> {
    try {
      this.logger.silly('filtering savings record');

      if(Types.ObjectId.isValid(status)){
        const singleSafe = await this.safeModel.findById(status).populate('user', ['firstname', 'lastname', 'email', 'picture']);
        if(singleSafe){
          return [].push(singleSafe)
        }
      }

      let params: any = {status}
      if (user) params = {...params, user}

      return await this.safeModel.find(params).populate('user', ['firstname', 'lastname', 'email', 'picture']).sort({createdAt: -1});
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async addfund(safeId: string, amount: number): Promise<ISafe> {
    try {
      console.log('safeId', safeId);
      const safeRecord : ISafe & Document = await this.safeModel.findById(safeId);

      console.log('safeRecord', safeRecord);

      safeRecord.amountRaised = safeRecord.amountRaised + amount;
      safeRecord.status = (safeRecord.amountRaised + amount ) >= safeRecord.goal ? 'completed' : safeRecord.status;
      return safeRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async updateSafeStatus({safeId, state}:{safeId: string, state: string}): Promise<ISafe> {
    try {
    
      this.logger.silly('updating safe');

      const safeRecord = await this.safeModel.findById(safeId); 
      if (!safeRecord) {
        this.logger.silly('safe not found');
        throw new SystemError(200, 'safe not found');
      }
      
      safeRecord.status = state;
      
      return await safeRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

}