import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
import { ITransactionInputDTO, ITransaction, IWallet, IUser } from '../../interfaces';
import { Console } from 'winston/lib/winston/transports';
import { TransactionService } from '../transaction';
import { AuthService } from '../auth';
import { SystemError } from '../../utils';
import * as EtheriumTransactionHelper from '../../drivers/etherium/bscScan/module/transaction';
import * as ether from '../../drivers/etherium/ethers/module/transaction';
import * as web3 from '../../drivers/etherium/web3/module/transaction';
import { any } from 'joi';

@Service()
export class WalletService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('walletModel') private walletModel: Models.WalletModel,
    private transactor: TransactionService,
    private userAccount: AuthService,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async credit(transaction: ITransactionInputDTO): Promise<ITransaction> {
    try {
      const wallet_id = transaction.walletId;
      this.logger.silly('crediting users wallet...');
      const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
      if (!checkIfUserWalletExists) {
        throw new SystemError(404, 'wallet not found');
      }
      //Credit Wallet
      const walletRecord = checkIfUserWalletExists;

      walletRecord.amount = walletRecord.amount.valueOf() + transaction.amount;
      await walletRecord.save();

      //instantiate transaction record keeping
      return await this.transactor.createTransaction(transaction);
      
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async debit(transaction: ITransactionInputDTO): Promise<ITransaction> {
    try {
      const wallet_id = transaction.walletId;
      this.logger.silly('debiting users wallet...');
      const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
      if (!checkIfUserWalletExists) {
        throw new SystemError(404, 'wallet not found');
      }
      //Debit Wallet
      const walletRecord = checkIfUserWalletExists;
      const AccountIsElidgible = walletRecord.amount >= transaction.amount ? true : false;
      if(!AccountIsElidgible){
        throw new SystemError(200, 'insufficient balance');
      }

      walletRecord.amount = walletRecord.amount.valueOf() - transaction.amount;
      await walletRecord.save();

      //instatiate transaction redord keeping
      return await this.transactor.createTransaction(transaction);
      
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async withdrawFund({user, amount, address}: {user: string, amount: number, address: string}): Promise<ITransaction> {
    try {
      const etherTx = await ether.sendEther({amount, address});
      // const etherTx = await ether.sendToken({amount, address});
      // const web3Tx = await web3.sendToken({amount, address});
      // if(!web3Tx){
      //   throw new SystemError(200, "Can't process your payment at the moment");
      // }

      throw new SystemError(200, "debug in progress....");
      const wallet_id = user;

      this.logger.silly('initiating withdrawal...');
      const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
      if (!checkIfUserWalletExists) {
        throw new SystemError(404, 'wallet not found');
      }

      const debitable = await this.debit({
        walletId: wallet_id,
        amount: amount,
        type: 'Debit',
        status: "Completed",
        fee: 0,
        subject: user,
        subjectRef: 'User',
        reason: 'Fund Withdrawal',
        from: process.env.ETH_WALLET_ADDRESS,
        recipient: address
      });

      if(!debitable){
        throw new SystemError(200, "Can't process your payment at the moment");
      }

      /**
       * initiate etherium transfer driver
       */

      return debitable;
      
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async getBalance(user: string): Promise<IWallet> {
    try {
      const wallet_id = user;
      this.logger.silly('getting users wallet info...');
      const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
      if (!checkIfUserWalletExists) {
        throw new SystemError(404, 'wallet not found');
      }

      const walletRecord = checkIfUserWalletExists;
      
      return walletRecord;
      
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async activateWallet(user: string, address: string): Promise<IUser | any> {
    try {
      const wallet_id = user;

      this.logger.silly('checking if account already activated...');
      const userIsActivated = await this.userModel.findById(wallet_id);
      if (!userIsActivated) {
        this.logger.silly('user not found');
        throw new SystemError(200, 'user not found');
      }
      if(userIsActivated.oneTimeSetup){
        throw new SystemError(200, `this account is already activated`);
      }

      // this.logger.silly('checking transaction status...');
      // if(await this.transactor.transactionExists(address)){
      //   throw new SystemError(200, `an account with this address is already validated`);
      // }

      this.logger.silly('getting users wallet info...');
      const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
      if (!checkIfUserWalletExists) {
        throw new SystemError(404, 'wallet not found');
      }

      const walletRecord = checkIfUserWalletExists;
      const { result } = await EtheriumTransactionHelper.FetchTransaction();
      const tx = result;
      console.log("deposits", tx);
      const tnx = tx.filter( async (tnx) => {
        const depositExists = await this.transactor.transactionExists(tnx.hash);
        return tnx.from === address.toLocaleLowerCase() && tnx.value >= 0.5 && !depositExists;
        // return tnx.from === address.toLocaleLowerCase() && tnx.value >= 0.5 
      });
      console.log(tnx);
      if(tnx.length <= 0){
        throw new SystemError(200, `we couldn't confirm your payment please make sure to send exact amount`);
      }
      await this.transactor.createTransaction({
        walletId: wallet_id,
        amount: 10,
        type: 'Debit',
        status: "Completed",
        fee: 0,
        subject: user,
        subjectRef: 'User',
        reason: 'Account Activation',
        from: address,
        txid: tnx.hash,
        recipient: process.env.ETH_WALLET_ADDRESS
      });

      userIsActivated.oneTimeSetup = true;
      await userIsActivated.save();
      return userIsActivated;
      
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

}