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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeService = void 0;
const typedi_1 = require("typedi");
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
let TradeService = class TradeService {
    constructor(tradeModel, contractModel, transactionModel, 
    // private transactor: TransactionService,
    logger) {
        this.tradeModel = tradeModel;
        this.contractModel = contractModel;
        this.transactionModel = transactionModel;
        this.logger = logger;
    }
    async startTrade(contract) {
        try {
            this.logger.silly('starting trade');
            const startedTrade = await this.tradeModel.create({
                userId: contract.userId,
                projectId: contract.projectId,
                contractId: contract.contractId,
                type: contract.type,
                status: contract.status,
                amount: contract.amount,
                interest: contract.interest,
                startDate: contract.startDate,
                endDate: contract.endDate,
                duration: contract.duration,
            });
            console.log("startedTrade", startedTrade);
            if (startedTrade) {
                //instantiate transaction record keeping
                this.logger.silly('creating transaction.');
                this.transactionModel.create({
                    user: contract.userId,
                    subject: (startedTrade === null || startedTrade === void 0 ? void 0 : startedTrade._id) || (startedTrade === null || startedTrade === void 0 ? void 0 : startedTrade.id),
                    subjectRef: 'Trade',
                    type: 'credit',
                    txid: Math.floor(100000 + Math.random() * 900000),
                    reason: "Supply Liquidity",
                    status: 'pending',
                    from: null,
                    confirmations: true,
                    fee: 0,
                    metadata: {
                        entity: "trade",
                        entityId: (startedTrade === null || startedTrade === void 0 ? void 0 : startedTrade.id) || (startedTrade === null || startedTrade === void 0 ? void 0 : startedTrade._id),
                    },
                    to: {
                        amount: contract.amount,
                        recipient: "swiftlynx"
                    },
                });
            }
            return startedTrade;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getTradeSummary(userId, status = 'ACTIVE') {
        try {
            const result = await this.tradeModel.aggregate([
                {
                    $match: {
                        userId: new mongoose_2.default.Types.ObjectId(userId),
                        status: status,
                        deleted: false,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: '$amount' },
                        totalInterest: { $sum: { $multiply: ['$amount', { $divide: ['$interest', 100] }] } },
                        tradeCount: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalAmount: 1,
                        totalInterest: 1,
                        totalAmountWithInterest: { $add: ['$totalAmount', '$totalInterest'] },
                        tradeCount: 1,
                    },
                },
            ]);
            if (result.length > 0) {
                return result[0];
            }
            else {
                return {
                    totalAmount: 0,
                    totalInterest: 0,
                    totalAmountWithInterest: 0,
                    tradeCount: 0,
                };
            }
        }
        catch (error) {
            console.error('Error fetching trade summary:', error);
            throw error;
        }
    }
    async getTrades(entityId) {
        try {
            this.logger.silly('getting my trade records');
            const tradeRecords = await this.tradeModel
                .find({ 'userId': entityId }).populate('contractId', 'contractName').sort({ createdAt: -1 });
            // get trade summary
            const tradeSum = await this.getTradeSummary(entityId);
            return {
                tradeSum,
                trades: tradeRecords
            };
        }
        catch (e) {
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async activateTrade(tradeId, amount) {
        try {
            await this.updateTrade({
                tradeId,
                amount
            });
            return await this.updateTradeStatus({
                tradeId,
                state: 'ACTIVE'
            });
        }
        catch (error) {
        }
    }
    async filter(status, user) {
        try {
            this.logger.silly('filtering trade record');
            if (mongoose_1.Types.ObjectId.isValid(status)) {
                const singleTrade = await this.tradeModel.findById(status).populate('userId', ['firstname', 'lastname', 'email', 'picture']);
                if (singleTrade) {
                    return [].push(singleTrade);
                }
            }
            let params = { status };
            if (user)
                params = Object.assign(Object.assign({}, params), { userId: user });
            const tradeRecords = await this.tradeModel.find(params).populate('userId', ['firstname', 'lastname', 'email', 'picture']).sort({ createdAt: -1 });
            // get trade summary
            const tradeSum = await this.getTradeSummary(params === null || params === void 0 ? void 0 : params.userId, params === null || params === void 0 ? void 0 : params.status);
            return {
                tradeSum,
                trades: tradeRecords
            };
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getContract(contractOrProjectId) {
        try {
            this.logger.silly('getting contract record');
            const contractRecord = await this.contractModel
                .find({ $or: [
                    { 'id': contractOrProjectId },
                    { 'projectId': contractOrProjectId },
                ] }).sort({ createdAt: -1 });
            return contractRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async signContract(contractId) {
        try {
            this.logger.silly('sign contract');
            const contractRecord = await this.contractModel
                .findOne({ 'id': contractId });
            if (!contractRecord)
                throw new utils_1.SystemError(404, `contract with this "contractID: ${contractId}" is not found`);
            return contractRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateContractStatistics(data) {
        try {
            this.logger.silly('updating contract statistics');
            const { contractId, statistics } = data;
            const contractRecord = await this.contractModel
                .findOne({ 'id': contractId });
            for (const property in statistics) {
                contractRecord.kpi[property] = contractRecord.kpi[property] + statistics[property];
            }
            await contractRecord.save();
            return contractRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateTrade(updateTrade) {
        try {
            this.logger.silly('updating trade');
            const userId = updateTrade.userId;
            const tradeId = updateTrade.tradeId;
            delete updateTrade.userId;
            delete updateTrade.projectId;
            const tradeRecord = await this.tradeModel.findOne({ 'id': tradeId });
            if (!tradeRecord) {
                this.logger.silly('trade not found');
                throw new utils_1.SystemError(200, 'trade not found');
            }
            for (const property in updateTrade) {
                tradeRecord[property] = updateTrade[property];
            }
            return await tradeRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateTradeStatus({ tradeId, state }) {
        try {
            this.logger.silly('updating trade');
            const tradeRecord = await this.tradeModel.findById(tradeId);
            if (!tradeRecord) {
                this.logger.silly('trade not found');
                throw new utils_1.SystemError(200, 'trade not found');
            }
            tradeRecord.status = state;
            if (state === "ACTIVE") {
                const dateRange = (0, utils_2.getDateRange)(parseInt(tradeRecord.duration));
                tradeRecord.startDate = dateRange.startDate;
                tradeRecord.endDate = dateRange.endDate;
            }
            return await tradeRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
TradeService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('tradeModel')),
    __param(1, (0, typedi_1.Inject)('contractModel')),
    __param(2, (0, typedi_1.Inject)('transactionModel')),
    __param(3, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], TradeService);
exports.TradeService = TradeService;
//# sourceMappingURL=index.js.map