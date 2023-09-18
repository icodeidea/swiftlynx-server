import { Service, Inject } from 'typedi';
import request from "request";
import { ITransactionInputDTO, ITransaction } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';
import { paystack } from '../../utils/'
import { SafeService } from '../safe';
import { ContractService } from '../contract';
import { TradeService } from '../trade';

@Service()
export class TransactionService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('walletModel') private walletModel: Models.WalletModel,
    @Inject('transactionModel') private transactionModel: Models.TransactionModel,
    //

    @Inject('contractModel') private contractModel: Models.ContractModel,
    @Inject('tradeModel') private tradeModel: Models.TradeModel,
    @Inject('safeModel') private safeModel: Models.SafeModel,
    private safe: SafeService,
    private contract: ContractService,
    private trade: TradeService,
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

  public async filterTransactions(reason: string, status: string): Promise<any> {
    try {
      const transactionRecord = await this.transactionModel.find({ reason, status }).populate('subject', ['firstname', 'lastname', 'email']);
      this.logger.silly('filter transactions');
      return transactionRecord;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getEntityTransactions(entity: string): Promise<any> {
    try {
      const transactionRecord = await this.transactionModel.find({ 'subject': entity });
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
        reason: entity === 'safe' ? 'savings' : entity === 'trade' ? 'trade' : 'contract',
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
      // console.log('paystack ref', ref);
      // console.log('paystack status', status);
      // console.log('paystack message', message);
      // console.log('paystack data', data);
      let verifiedEntity = null;

      if (!status) {
        throw new Error(message);
      }

      if(data){
        if(data !== "success"){
          throw new Error(data.gateway_response);
        }
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
      }
      if(transactionDoc.metadata.entity === 'trade'){
        verifiedEntity = await this.trade.activateTrade(transactionDoc.metadata.entityId, amount)
      }
      // else{
      //   verifiedEntity = await this.contract.signContract(transactionDoc.metadata.entityId, transactionDoc.user, amount);
      // }
      transactionDoc.status = 'completed';
      transactionDoc.to.amount = amount;
      transactionDoc.save();
      return verifiedEntity;
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getBusinessKpi({
    userId,
  }: {
    userId: string;
  }): Promise<any> {
    try {
      // get total users

      const totalUsers = await this.userModel.count();

      //################################

      // get total loans
      const totalLoans = await this.contractModel.count();

      // get active loans
      const totalActiveLoans = await this.contractModel.count({
        state: 'ACTIVE'
      });

      // get total pending loans
      const totalPendingLoans = await this.contractModel.count({
        state: 'PENDING'
      });

      // get total completed loans
      const totalCompletedLoans = await this.contractModel.count({
        state: 'COMPLETED'
      });

      // get total declined loans
      const totalDeclinedLoans = await this.contractModel.count({
        state: 'DECLINED'
      });

      // get total loan amount
      const totalActiveLoansAmount = await this.contractModel.aggregate([{
        $match : { $and : [{status: 'PENDING' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$fixedAmount"
              }
          }
      }]);

      // get total loan amount roi
      const totalActiveLoansInterest = await this.contractModel.aggregate([{
        $match : { $and : [{status: 'PENDING' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$interest"
              }
          }
      }]);

      //################################

      // get total investments
      const totalInvestments = await this.tradeModel.count();
      
      // get total pending investments
      const totalActiveInvestments = await this.tradeModel.count({
        status: 'ACTIVE'
      });

      // get total completed investments
      const totalCompletedInvestments = await this.tradeModel.count({
        status: 'COMPLETED'
      });

      // get total pending investments
      const totalPendingInvestments = await this.tradeModel.count({
        status: 'PENDING'
      });

      // get total declined investments
      const totalDeclinedInvestments = await this.tradeModel.count({
        status: 'DECLINED'
      });

      // get total investments amount
      const totalActiveInvestmentAmount = await this.tradeModel.aggregate([{
        $match : { $and : [{status: 'ACTIVE' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$amount"
              }
          }
      }]);

      // get total investments amount roi
      const totalActiveInvestmetRoi = await this.tradeModel.aggregate([{
        $match : { $and : [{status: 'ACTIVE' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$interest"
              }
          }
      }]);

      //################################

      // get total savings
      const totalSavings = await this.safeModel.count();

      // get total active savings
      const totalActiveSavings = await this.safeModel.count({ status: 'active' });

      // get total completed savings
      const totalCompletedSavings = await this.safeModel.count({ status: 'completed' });

      // get total pending savings
      const totalPendingSavings = await this.safeModel.count({ status: 'pending' });

      // get total declined savings
      const totalDeclinedSavings = await this.safeModel.count({ status: 'declined' });

      // get total savings amount
      const totalAmountInSavings = await this.safeModel.aggregate([{
        $match : { $and : [{ status: 'active' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$amountRaised"
              }
          }
      }]);

      // get total pending transactions amount
      const totalPendingTransactionAmount = await this.transactionModel.aggregate([{
        $match : { $and : [{status: 'pending' }] },
      },{
          $group : {
              _id : null,
              total : {
                  $sum : "$to.amount"
              }
          }
      }]);

      // get total pending transactions
      const totalPendingTransaction = await this.transactionModel.count({ status: 'pending' });

      return {
        users: {
          totalUsers,
        },
        loans: {
          totalLoans,
          totalActiveLoans,
          totalPendingLoans,
          totalCompletedLoans,
          totalDeclinedLoans,
          totalActiveLoansAmount: totalActiveLoansAmount[0]?.total || 0,
          totalActiveLoansRoi: (totalActiveLoansAmount[0]?.total * totalActiveLoansInterest[0]?.total) / 100 || 0
        },
        investments: {
          totalInvestments,
          totalActiveInvestments,
          totalCompletedInvestments,
          totalPendingInvestments,
          totalDeclinedInvestments,
          totalActiveInvestmentAmount: totalActiveInvestmentAmount[0]?.total || 0,
          totalActiveInvestmetRoi: (totalActiveInvestmentAmount[0]?.total * totalActiveInvestmetRoi[0]?.total) / 100 || 0
        },
        savings: {
          totalSavings,
          totalActiveSavings,
          totalCompletedSavings,
          totalPendingSavings,
          totalDeclinedSavings,
          totalAmountInSavings: totalAmountInSavings[0]?.total || 0
        },
        transactions: {
          totalPendingTransactionAmount: totalPendingTransactionAmount[0].total || 0,
          totalPendingTransaction
        }
      }
    } catch (error) {
      
    }
  }

  
}