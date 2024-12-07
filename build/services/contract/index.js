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
exports.ContractService = void 0;
const typedi_1 = require("typedi");
const mongoose_1 = require("mongoose");
const utils_1 = require("../../utils");
const project_1 = require("../project");
const trade_1 = require("../trade");
const mailer_1 = require("../mailer");
let ContractService = class ContractService {
    constructor(contractModel, userModel, logger, mailer, project, trade) {
        this.contractModel = contractModel;
        this.userModel = userModel;
        this.logger = logger;
        this.mailer = mailer;
        this.project = project;
        this.trade = trade;
    }
    async addContract(contract) {
        try {
            this.logger.silly('adding contract');
            let amountManager = null;
            const projectExist = this.project.getProject(contract.projectId);
            if (!projectExist) {
                throw new utils_1.SystemError(400, `project with this "projectID" is not found`);
            }
            if (contract.fixedAmount) {
                if (contract.fixedAmount < 1000) {
                    throw new utils_1.SystemError(400, 'amount should be up to 1000');
                }
                amountManager = {
                    fixedAmount: contract.fixedAmount
                };
            }
            if (contract.minAmount && contract.maxAmount) {
                if (contract.minAmount < 1000) {
                    throw new utils_1.SystemError(400, 'minimum amount should be up to 1000');
                }
                if (contract.maxAmount <= contract.minAmount) {
                    throw new utils_1.SystemError(400, 'maximum amount cannot be lower than or equals minimum amount');
                }
                amountManager = {
                    minAmount: contract.minAmount,
                    maxAmount: contract.maxAmount,
                };
            }
            if (amountManager === null) {
                throw new utils_1.SystemError(400, 'please provide a contract model');
            }
            const addedContract = await this.contractModel.create(Object.assign({ userId: contract.userId, projectId: contract.projectId, contractName: contract.contractName, description: contract.description, type: contract.type, interest: contract.interest, maturityTime: contract.maturityTime }, amountManager));
            this.project.updateProjectStatistics({
                projectId: contract.projectId,
                statistics: {
                    totalContract: 1
                }
            });
            return addedContract;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getContract(contractOrProjectId) {
        try {
            this.logger.silly('getting contract record');
            console.log('contractOrProjectId', contractOrProjectId);
            const contractRecord = await this.contractModel
                .find({ 'projectId': contractOrProjectId }).sort({ createdAt: -1 });
            //   .find({$or: [
            //       { 'id': contractOrProjectId },
            //       { 'projectId': contractOrProjectId },
            //     ]});
            return contractRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getAllContract(userId) {
        try {
            this.logger.silly('getting all user contract record');
            const contractRecord = await this.contractModel
                .find({ 'userId': userId }).sort({ createdAt: -1 });
            //   .find({$or: [
            //       { 'id': contractOrProjectId },
            //       { 'projectId': contractOrProjectId },
            //     ]});
            return contractRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async filter(state, user) {
        try {
            this.logger.silly('filtering contract record');
            if (mongoose_1.Types.ObjectId.isValid(state)) {
                const singleContract = await this.contractModel.findById(state).populate('userId', ['firstname', 'lastname', 'email', 'picture']).populate('projectId', ['projectName', 'projectDescription']);
                if (singleContract) {
                    return [].push(singleContract);
                }
            }
            let params = { state };
            if (user)
                params = Object.assign(Object.assign({}, params), { userId: user });
            console.log(params);
            return await this.contractModel.find(params).populate('userId', ['firstname', 'lastname', 'email', 'picture']).populate('projectId', ['projectName', 'projectDescription']).sort({ createdAt: -1 });
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async signContract(contractId, userId, amount) {
        try {
            this.logger.silly('sign contract');
            const contractRecord = await this.contractModel
                .findOne({ 'id': contractId });
            if (!contractRecord)
                throw new utils_1.SystemError(404, `contract with this "contractId: ${contractId}" is not found`);
            if (contractRecord.minAmount && contractRecord.maxAmount) {
                if (contractRecord.minAmount > amount) {
                    throw new utils_1.SystemError(400, `minimum amount should be up to ${contractRecord.minAmount}`);
                }
                if (amount > contractRecord.maxAmount) {
                    throw new utils_1.SystemError(400, `amount cannot be greater than ${contractRecord.maxAmount}`);
                }
            }
            const tradeRecord = await this.trade.startTrade({
                userId,
                amount: contractRecord.fixedAmount ? contractRecord.fixedAmount : amount,
                projectId: contractRecord.projectId,
                contractId: contractRecord.id,
                type: contractRecord.type,
                status: 'ACTIVE',
                interest: contractRecord.interest,
                startDate: `${Date.now()}`,
                endDate: contractRecord.maturityTime,
                duration: '6',
            });
            this.project.updateProjectStatistics({
                projectId: contractRecord.projectId,
                statistics: {
                    totalTrade: 1
                }
            });
            return tradeRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async requestPaymentConfirmation(user, entityId) {
        try {
            this.logger.silly('requesting payment confirmation');
            const userRecord = await this.userModel.findById(user);
            const contractRecord = await this.contractModel
                .findOne({ 'id': entityId, userId: user });
            await this.mailer.ConfirmpaymentRequestMail(userRecord, contractRecord);
            return null;
        }
        catch (e) {
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
    async updateContract(updateContract) {
        try {
            this.logger.silly('updating contract');
            const userId = updateContract.userId;
            const contractId = updateContract.contractId;
            delete updateContract.userId;
            delete updateContract.projectId;
            const contractRecord = await this.contractModel.findOne({ 'id': contractId, userId });
            if (!contractRecord) {
                this.logger.silly('contract not found');
                throw new utils_1.SystemError(200, 'project not found');
            }
            for (const property in updateContract) {
                contractRecord[property] = updateContract[property];
            }
            return await contractRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateContractState({ contractId, state }) {
        try {
            this.logger.silly('updating contract');
            console.log('contractId', contractId);
            const contractRecord = await this.contractModel.findById(contractId);
            if (!contractRecord) {
                this.logger.silly('contract not found');
                throw new utils_1.SystemError(200, 'project not found');
            }
            contractRecord.state = state;
            const updatedContract = await contractRecord.save();
            console.log('updatedContract', updatedContract);
            return updatedContract;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async deleteContract({ userId, contractId }) {
        this.logger.silly('Deleting Contract...');
        try {
            const contractRecord = await this.contractModel
                .findOne({ 'id': contractId, userId });
            if (!contractRecord) {
                throw new Error('contract not found');
            }
            const contractDeleted = await this.contractModel.findByIdAndDelete(contractId);
            if (contractDeleted) {
                this.logger.silly('contract deleted!');
                return 'this contract is permanently deleted';
            }
            else {
                throw new Error('this contract is unable to delete at the moment, please try again later');
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
ContractService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('contractModel')),
    __param(1, (0, typedi_1.Inject)('userModel')),
    __param(2, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, Object, mailer_1.MailerService,
        project_1.ProjectService,
        trade_1.TradeService])
], ContractService);
exports.ContractService = ContractService;
//# sourceMappingURL=index.js.map