import { Service, Inject } from 'typedi';
import request from "request";
import { ITransactionInputDTO, ITransaction } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';
import { paystack } from '../../utils/'
import { SafeService } from '../safe';
import { ContractService } from '../contract';

@Service()
export class TransactionService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('walletModel') private walletModel: Models.WalletModel,
    @Inject('transactionModel') private transactionModel: Models.TransactionModel,
    private safe: SafeService,
    private contract: ContractService,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
  ) {}

  public async createTransaction(tx: ITransactionInputDTO): Promise<ITransaction> {
    try {
      const walletRecord = await this.walletModel.findOne({ user: tx.walletId });
      this.logger.silly('creating transaction.');
      const userTransaction: ITransaction & Document = await this.transactionModel.create({
        user: tx.walletId,
        subject: tx.subject,
        subjectRef: tx.subjectRef,
        type: tx.type,
        txid: tx.txid || Math.floor(100000 + Math.random() * 900000),
        reason: tx.reason,
        status: tx.status,
        from: tx.from || null,
        confirmations: true,
        fee: 0,
        metadata: tx.metadata,
        to:
          {
            amount: tx.amount,
            recipient: tx.recipient || null
          },
      });
      const data = userTransaction;
      return data;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getTransactionInfo(wallet_id: string, txid: string): Promise<(ITransaction & Document) | any> {
    try {
      const transactionRecord = await this.transactionModel
        .find({ user: wallet_id })
        .where({ to: { $elemMatch: { txid: txid } } });
      // .or([{ txid: txid }]);
      this.logger.silly('geting transaction information');
      return transactionRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async transactionExists(from: string): Promise<(ITransaction & Document) | any> {
    try {
      const transactionRecord = await this.transactionModel
        .findOne({ from: from });
      this.logger.silly('geting transaction information');
      return transactionRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getTransactions(wallet_id: string): Promise<any> {
    try {
      const transactionRecord = await this.transactionModel.find({ user: wallet_id });
      this.logger.silly('geting transaction information');
      return transactionRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async initialisePayment(userId: string, amount: number, entity: string, entityId: string): Promise<any> {
    try {
      const { initializePayment } = paystack();
      const userRecord = await this.userModel.findOne({ '_id': userId });
      const form: any = {};
      form.metadata = {
        fullName: `${userRecord?.firstname} ${userRecord?.lastname}`,
      };
      form.amount = amount;
      form.amount *= 100;
      form.email = userRecord?.email;

      const {status, message, data } = await initializePayment(form);
      
      if (!status) {
        throw new Error(message);
      }
      const authUrl = data.authorization_url;
      return await this.createTransaction({
        txid: data.reference,
        amount: amount,
        metadata: { ...data, entity, entityId },
        walletId: userRecord?._id,
        subject: userRecord?._id,
        subjectRef: 'User',
        type: 'credit',
        reason: entity === 'safe' ? 'savings' : 'contract',
        status: 'pending',
      })
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async verifyPayment(ref: any): Promise<any> {
    try {
      const { verifyPayment } = paystack();
      const { status, message, data } = await verifyPayment(ref);
      let verifiedEntity = null;

      if (!status) {
        throw new Error(message);
      }
  
      const {
        reference,
        metadata,
        amount
      } = data;

      const transactionDoc = await this.transactionModel.findOne({ txid: reference, status: 'pending', });
      if(!transactionDoc){
        throw new Error('no pending transaction found');
      }

      if(transactionDoc.metadata.entity === 'safe'){
        verifiedEntity = await this.safe.addfund(transactionDoc.metadata.entityId, amount)
      }else{
        verifiedEntity = await this.contract.signContract(transactionDoc.metadata.entityId, transactionDoc.user, amount);
      }
      transactionDoc.status = 'completed';
      transactionDoc.to.amount = amount;
      transactionDoc.save();
      return verifiedEntity;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  
}