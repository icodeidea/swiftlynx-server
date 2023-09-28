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
const trade_1 = require("../trade");
let TransactionService = class TransactionService {
    constructor(userModel, walletModel, transactionModel, 
    //
    contractModel, tradeModel, safeModel, safe, contract, trade, logger) {
        this.userModel = userModel;
        this.walletModel = walletModel;
        this.transactionModel = transactionModel;
        this.contractModel = contractModel;
        this.tradeModel = tradeModel;
        this.safeModel = safeModel;
        this.safe = safe;
        this.contract = contract;
        this.trade = trade;
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
    async filterTransactions(reason, status) {
        try {
            const transactionRecord = await this.transactionModel.find({ reason, status }).populate('subject', ['firstname', 'lastname', 'email', 'picture']);
            this.logger.silly('filter transactions');
            return transactionRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getEntityTransactions(entity) {
        try {
            const transactionRecord = await this.transactionModel.find({ 'metadata.entityId': entity });
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
            const userRecord = await this.userModel.findById(userId);
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
                amount: amount,
                metadata: Object.assign(Object.assign({}, data), { entity, entityId }),
                walletId: userRecord === null || userRecord === void 0 ? void 0 : userRecord._id,
                subject: userRecord === null || userRecord === void 0 ? void 0 : userRecord._id,
                subjectRef: 'User',
                type: 'credit',
                reason: entity === 'safe' ? 'savings' : entity === 'trade' ? 'trade' : 'contract',
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
            console.log('paystack ref', ref);
            console.log('paystack status', status);
            console.log('paystack message', message);
            console.log('paystack data', data);
            let verifiedEntity = null;
            if (!status) {
                throw new Error(message);
            }
            if (data) {
                if (data.status !== "success") {
                    throw new Error(data.gateway_response);
                }
            }
            const { reference, metadata, amount } = data;
            const transactionDoc = await this.transactionModel.findOne({ txid: reference, status: 'pending', });
            console.log('transactionDoc', transactionDoc);
            if (!transactionDoc) {
                throw new Error('no pending transaction found');
            }
            if (transactionDoc.metadata.entity === 'safe') {
                verifiedEntity = await this.safe.addfund(transactionDoc.metadata.entityId, transactionDoc.to.amount);
            }
            if (transactionDoc.metadata.entity === 'trade') {
                verifiedEntity = await this.trade.activateTrade(transactionDoc.metadata.entityId, transactionDoc.to.amount);
            }
            // else{
            //   verifiedEntity = await this.contract.signContract(transactionDoc.metadata.entityId, transactionDoc.user, amount);
            // }
            transactionDoc.status = 'completed';
            // transactionDoc.to.amount = amount;
            transactionDoc.save();
            return verifiedEntity;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getBusinessKpi({ userId, }) {
        var _a, _b, _c, _d, _e, _f, _g;
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
                    $match: { $and: [{ state: 'PENDING' }] },
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$fixedAmount"
                        }
                    }
                }]);
            // get total loan amount roi
            const totalActiveLoansInterest = await this.contractModel.aggregate([{
                    $match: { $and: [{ state: 'PENDING' }] },
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$interest"
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
                    $match: { $and: [{ status: 'ACTIVE' }] },
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount"
                        }
                    }
                }]);
            // get total investments amount roi
            const totalActiveInvestmetRoi = await this.tradeModel.aggregate([{
                    $match: { $and: [{ status: 'ACTIVE' }] },
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$interest"
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
                    $match: { $and: [{ status: 'active' }] },
                }, {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amountRaised"
                        }
                    }
                }]);
            // get total pending transactions amount
            const totalPendingTransactionAmount = await this.transactionModel.aggregate([{
                    $match: { $and: [{ status: 'pending' }] },
                },
                // {$unwind: '$to'},
                {
                    $group: {
                        _id: null,
                        total: {
                            "$sum": "$to.$amount"
                        }
                    }
                }]);
            console.log(totalPendingTransactionAmount);
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
                    totalActiveLoansAmount: ((_a = totalActiveLoansAmount[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                    totalActiveLoansRoi: (((_b = totalActiveLoansAmount[0]) === null || _b === void 0 ? void 0 : _b.total) * ((_c = totalActiveLoansInterest[0]) === null || _c === void 0 ? void 0 : _c.total)) / 100 || 0
                },
                investments: {
                    totalInvestments,
                    totalActiveInvestments,
                    totalCompletedInvestments,
                    totalPendingInvestments,
                    totalDeclinedInvestments,
                    totalActiveInvestmentAmount: ((_d = totalActiveInvestmentAmount[0]) === null || _d === void 0 ? void 0 : _d.total) || 0,
                    totalActiveInvestmetRoi: (((_e = totalActiveInvestmentAmount[0]) === null || _e === void 0 ? void 0 : _e.total) * ((_f = totalActiveInvestmetRoi[0]) === null || _f === void 0 ? void 0 : _f.total)) / 100 || 0
                },
                savings: {
                    totalSavings,
                    totalActiveSavings,
                    totalCompletedSavings,
                    totalPendingSavings,
                    totalDeclinedSavings,
                    totalAmountInSavings: ((_g = totalAmountInSavings[0]) === null || _g === void 0 ? void 0 : _g.total) || 0
                },
                transactions: {
                    totalPendingTransactionAmount: totalPendingTransactionAmount[0].total || 0,
                    totalPendingTransaction
                }
            };
        }
        catch (error) {
        }
    }
};
TransactionService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('walletModel')),
    __param(2, (0, typedi_1.Inject)('transactionModel')),
    __param(3, (0, typedi_1.Inject)('contractModel')),
    __param(4, (0, typedi_1.Inject)('tradeModel')),
    __param(5, (0, typedi_1.Inject)('safeModel')),
    __param(9, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, safe_1.SafeService,
        contract_1.ContractService,
        trade_1.TradeService, Object])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=index.js.map