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
const utils_1 = require("../../utils");
const project_1 = require("../project");
const trade_1 = require("../trade");
let ContractService = class ContractService {
    constructor(contractModel, logger, project, trade) {
        this.contractModel = contractModel;
        this.logger = logger;
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
                .find({ 'projectId': contractOrProjectId });
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
    async signContract(contractId, userId, amount) {
        try {
            this.logger.silly('sign contract');
            console.log('sfjfd', amount);
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
                endDate: contractRecord.maturityTime
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
    __param(1, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, project_1.ProjectService,
        trade_1.TradeService])
], ContractService);
exports.ContractService = ContractService;
//# sourceMappingURL=index.js.map