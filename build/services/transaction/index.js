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
const utils_2 = require("../../utils/");
const safe_1 = require("../safe");
const contract_1 = require("../contract");
let TransactionService = class TransactionService {
    constructor(userModel, walletModel, transactionModel, safe, contract, logger) {
        this.userModel = userModel;
        this.walletModel = walletModel;
        this.transactionModel = transactionModel;
        this.safe = safe;
        this.contract = contract;
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
                metadata: tx.metadata,
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
    async initialisePayment(userId, amount, entity, entityId) {
        try {
            const { initializePayment } = (0, utils_2.paystack)();
            const userRecord = await this.userModel.findOne({ '_id': userId });
            const form = {};
            form.metadata = {
                fullName: `${userRecord === null || userRecord === void 0 ? void 0 : userRecord.firstname} ${userRecord === null || userRecord === void 0 ? void 0 : userRecord.lastname}`,
            };
            form.amount = amount;
            form.amount *= 100;
            form.email = userRecord === null || userRecord === void 0 ? void 0 : userRecord.email;
            const { status, message, data } = await initializePayment(form);
            if (!status) {
                throw new Error(message);
            }
            const authUrl = data.authorization_url;
            return await this.createTransaction({
                txid: data.reference,
                amount: data.amount,
                metadata: Object.assign(Object.assign({}, data), { entity, entityId }),
                walletId: userRecord === null || userRecord === void 0 ? void 0 : userRecord._id,
                subject: userRecord === null || userRecord === void 0 ? void 0 : userRecord._id,
                subjectRef: 'User',
                type: 'credit',
                reason: entity === 'safe' ? 'savings' : 'contract',
                status: 'pending',
            });
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async verifyPayment(ref) {
        try {
            const { verifyPayment } = (0, utils_2.paystack)();
            const { status, message, data } = await verifyPayment(ref);
            if (!status) {
                throw new Error(message);
            }
            const { reference, metadata, amount } = data;
            const transactionDoc = await this.transactionModel.findOne({ txid: reference });
            if (transactionDoc.metadata.entity === 'safe') {
                return await this.safe.addfund(transactionDoc.metadata.entityId, amount);
            }
            else {
                return await this.contract.signContract(transactionDoc.metadata.entityId, transactionDoc.user, amount);
            }
            throw new Error('failed');
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
TransactionService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('walletModel')),
    __param(2, (0, typedi_1.Inject)('transactionModel')),
    __param(5, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, Object, safe_1.SafeService,
        contract_1.ContractService, Object])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=index.js.map