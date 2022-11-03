"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const typedi_1 = require("typedi");
const utils_1 = require("../../utils");
let TransactionService = class TransactionService {
    constructor(walletModel, transactionModel, logger) {
        this.walletModel = walletModel;
        this.transactionModel = transactionModel;
        this.logger = logger;
    }
    async createTransaction(tx) {
        try {
            const walletRecord = await this.walletModel.findOne({ user: tx.walletId });
            this.logger.silly('creating transaction.');
            const userTransaction = await this.transactionModel.create({
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
                to: {
                    amount: tx.amount,
                    recipient: tx.recipient || null
                },
            });
            const data = userTransaction;
            return data;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getTransactionInfo(wallet_id, txid) {
        try {
            const transactionRecord = await this.transactionModel
                .find({ user: wallet_id })
                .where({ to: { $elemMatch: { txid: txid } } });
            // .or([{ txid: txid }]);
            this.logger.silly('geting transaction information');
            return transactionRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async transactionExists(from) {
        try {
            const transactionRecord = await this.transactionModel
                .findOne({ from: from });
            this.logger.silly('geting transaction information');
            return transactionRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getTransactions(wallet_id) {
        try {
            const transactionRecord = await this.transactionModel.find({ user: wallet_id });
            this.logger.silly('geting transaction information');
            return transactionRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
TransactionService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('walletModel')),
    __param(1, (0, typedi_1.Inject)('transactionModel')),
    __param(2, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, Object])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=index.js.map