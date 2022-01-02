import { Service, Inject } from 'typedi';
import { ITransactionInputDTO, ITransaction } from '../../interfaces';
import { Document } from 'mongoose';
import { SystemError } from '../../utils';

@Service()
export class TransactionService {
  constructor(
    @Inject('walletModel') private walletModel: Models.WalletModel,
    @Inject('transactionModel') private transactionModel: Models.TransactionModel,
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
}