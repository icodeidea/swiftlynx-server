"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const typedi_1 = require("typedi");
const eventDispatcher_1 = require("../../decorators/eventDispatcher");
const transaction_1 = require("../transaction");
const auth_1 = require("../auth");
const utils_1 = require("../../utils");
const EtheriumTransactionHelper = __importStar(require("../../drivers/etherium/bscScan/module/transaction"));
const ether = __importStar(require("../../drivers/etherium/ethers/module/transaction"));
let WalletService = class WalletService {
    constructor(userModel, walletModel, transactor, userAccount, logger, eventDispatcher) {
        this.userModel = userModel;
        this.walletModel = walletModel;
        this.transactor = transactor;
        this.userAccount = userAccount;
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
    }
    async credit(transaction) {
        try {
            const wallet_id = transaction.walletId;
            this.logger.silly('crediting users wallet...');
            const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
            if (!checkIfUserWalletExists) {
                throw new utils_1.SystemError(404, 'wallet not found');
            }
            //Credit Wallet
            const walletRecord = checkIfUserWalletExists;
            walletRecord.amount = walletRecord.amount.valueOf() + transaction.amount;
            await walletRecord.save();
            //instantiate transaction record keeping
            return await this.transactor.createTransaction(transaction);
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async debit(transaction) {
        try {
            const wallet_id = transaction.walletId;
            this.logger.silly('debiting users wallet...');
            const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
            if (!checkIfUserWalletExists) {
                throw new utils_1.SystemError(404, 'wallet not found');
            }
            //Debit Wallet
            const walletRecord = checkIfUserWalletExists;
            const AccountIsElidgible = walletRecord.amount >= transaction.amount ? true : false;
            if (!AccountIsElidgible) {
                throw new utils_1.SystemError(200, 'insufficient balance');
            }
            walletRecord.amount = walletRecord.amount.valueOf() - transaction.amount;
            await walletRecord.save();
            //instatiate transaction redord keeping
            return await this.transactor.createTransaction(transaction);
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async withdrawFund({ user, amount, address }) {
        try {
            const etherTx = await ether.sendEther({ amount, address });
            // const etherTx = await ether.sendToken({amount, address});
            // const web3Tx = await web3.sendToken({amount, address});
            // if(!web3Tx){
            //   throw new SystemError(200, "Can't process your payment at the moment");
            // }
            throw new utils_1.SystemError(200, "debug in progress....");
            const wallet_id = user;
            this.logger.silly('initiating withdrawal...');
            const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
            if (!checkIfUserWalletExists) {
                throw new utils_1.SystemError(404, 'wallet not found');
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
            if (!debitable) {
                throw new utils_1.SystemError(200, "Can't process your payment at the moment");
            }
            /**
             * initiate etherium transfer driver
             */
            return debitable;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getBalance(user) {
        try {
            const wallet_id = user;
            this.logger.silly('getting users wallet info...');
            const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
            if (!checkIfUserWalletExists) {
                throw new utils_1.SystemError(404, 'wallet not found');
            }
            const walletRecord = checkIfUserWalletExists;
            return walletRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async activateWallet(user, address) {
        try {
            const wallet_id = user;
            this.logger.silly('checking if account already activated...');
            const userIsActivated = await this.userModel.findById(wallet_id);
            if (!userIsActivated) {
                this.logger.silly('user not found');
                throw new utils_1.SystemError(200, 'user not found');
            }
            if (userIsActivated.oneTimeSetup) {
                throw new utils_1.SystemError(200, `this account is already activated`);
            }
            // this.logger.silly('checking transaction status...');
            // if(await this.transactor.transactionExists(address)){
            //   throw new SystemError(200, `an account with this address is already validated`);
            // }
            this.logger.silly('getting users wallet info...');
            const checkIfUserWalletExists = await this.walletModel.findOne({ user: wallet_id });
            if (!checkIfUserWalletExists) {
                throw new utils_1.SystemError(404, 'wallet not found');
            }
            const walletRecord = checkIfUserWalletExists;
            const { result } = await EtheriumTransactionHelper.FetchTransaction();
            const tx = result;
            console.log("deposits", tx);
            const tnx = tx.filter(async (tnx) => {
                const depositExists = await this.transactor.transactionExists(tnx.hash);
                return tnx.from === address.toLocaleLowerCase() && tnx.value >= 0.5 && !depositExists;
                // return tnx.from === address.toLocaleLowerCase() && tnx.value >= 0.5 
            });
            console.log(tnx);
            if (tnx.length <= 0) {
                throw new utils_1.SystemError(200, `we couldn't confirm your payment please make sure to send exact amount`);
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
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
WalletService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('walletModel')),
    __param(4, (0, typedi_1.Inject)('logger')),
    __param(5, (0, eventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [Object, Object, transaction_1.TransactionService,
        auth_1.AuthService, Object, eventDispatcher_1.EventDispatcherInterface])
], WalletService);
exports.WalletService = WalletService;
//# sourceMappingURL=index.js.map