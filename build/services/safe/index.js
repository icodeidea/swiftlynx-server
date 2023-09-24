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
exports.SafeService = void 0;
const typedi_1 = require("typedi");
const eventDispatcher_1 = require("../../decorators/eventDispatcher");
const transaction_1 = require("../transaction");
const auth_1 = require("../auth");
const utils_1 = require("../../utils");
let SafeService = class SafeService {
    constructor(userModel, walletModel, safeModel, transactor, userAccount, logger, eventDispatcher) {
        this.userModel = userModel;
        this.walletModel = walletModel;
        this.safeModel = safeModel;
        this.transactor = transactor;
        this.userAccount = userAccount;
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
    }
    async startSavings(data, userId) {
        try {
            return await this.safeModel.create({
                user: userId,
                remark: data.remark,
                goal: data.goal
            });
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async list(userId, safeId) {
        try {
            this.logger.silly('getting savings record');
            if (!safeId || safeId === null)
                return await this.safeModel.find({ user: userId });
            if (safeId)
                return await this.safeModel.find({ _id: safeId });
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async filter(status) {
        try {
            this.logger.silly('filtering savings record');
            return await this.safeModel.find({ status }).populate('user', ['firstname', 'lastname', 'email', 'picture']);
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async addfund(safeId, amount) {
        try {
            console.log('safeId', safeId);
            const safeRecord = await this.safeModel.findById(safeId);
            console.log('safeRecord', safeRecord);
            safeRecord.amountRaised = safeRecord.amountRaised + amount;
            safeRecord.status = (safeRecord.amountRaised + amount) >= safeRecord.goal ? 'completed' : safeRecord.status;
            return safeRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateSafeStatus({ safeId, state }) {
        try {
            this.logger.silly('updating safe');
            const safeRecord = await this.safeModel.findById(safeId);
            if (!safeRecord) {
                this.logger.silly('safe not found');
                throw new utils_1.SystemError(200, 'safe not found');
            }
            safeRecord.status = state;
            return await safeRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
SafeService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('walletModel')),
    __param(2, (0, typedi_1.Inject)('safeModel')),
    __param(5, (0, typedi_1.Inject)('logger')),
    __param(6, (0, eventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [Object, Object, Object, transaction_1.TransactionService,
        auth_1.AuthService, Object, eventDispatcher_1.EventDispatcherInterface])
], SafeService);
exports.SafeService = SafeService;
//# sourceMappingURL=index.js.map