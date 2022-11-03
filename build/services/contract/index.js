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
let ContractService = class ContractService {
    constructor(contractModel, logger, project) {
        this.contractModel = contractModel;
        this.logger = logger;
        this.project = project;
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
            const addedContract = await this.contractModel.create(Object.assign({ userId: contract.userId, projectId: contract.projectId, contractName: contract.contractName, type: contract.type, interest: contract.interest, maturityTime: contract.maturityTime }, amountManager));
            await this.project.updateProjectStatistics({
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
            const contractRecord = await this.contractModel
                .find({ $or: [
                    { 'id': contractOrProjectId },
                    { 'projectId': contractOrProjectId },
                ] });
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
};
ContractService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('contractModel')),
    __param(1, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, project_1.ProjectService])
], ContractService);
exports.ContractService = ContractService;
//# sourceMappingURL=index.js.map