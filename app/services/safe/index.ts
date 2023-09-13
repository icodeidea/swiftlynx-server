import { Service, Inject } from 'typedi';
import { Document } from 'mongoose';
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

      if(!safeId || safeId === null) return await this.safeModel.find({user: userId});

      if(safeId) return await this.safeModel.find({_id: safeId});
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async filter(status: string): Promise<any> {
    try {
      this.logger.silly('filtering savings record');

      return await this.safeModel.find({status});
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async addfund(safeId: string, amount: number): Promise<ISafe> {
    try {
      const safeRecord : ISafe & Document = await this.safeModel.findOne({'_id': safeId});

      safeRecord.amountRaised = safeRecord.amountRaised + amount;
      safeRecord.status = (safeRecord.amountRaised + amount ) >= safeRecord.goal ? 'completed' : safeRecord.status;
      return safeRecord.save();
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async updateSafeStatus({contractId, state}:{contractId: string, state: string}): Promise<ISafe> {
    try {
    
      this.logger.silly('updating safe');

      const safeRecord = await this.safeModel.findOne({'id': contractId}); 
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