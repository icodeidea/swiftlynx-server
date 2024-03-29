"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signContractSchema = exports.getContractSchema = exports.updateContractSchema = exports.addContractSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addContractSchema = joi_1.default.object({
    projectId: joi_1.default.string().required().max(100),
    contractName: joi_1.default.string().required().max(100),
    description: joi_1.default.string().required().max(300),
    fixedAmount: joi_1.default.number().min(1000),
    minAmount: joi_1.default.number().min(1000),
    maxAmount: joi_1.default.number(),
    type: joi_1.default.string().valid("SWIFT_LOAN", "PEER_TO_PEER_LOAN").required().max(100),
    interest: joi_1.default.number().required(),
    maturityTime: joi_1.default.string().required(),
});
exports.updateContractSchema = joi_1.default.object({
    contractId: joi_1.default.string().required().max(100),
    contractName: joi_1.default.string(),
    state: joi_1.default.string(),
    description: joi_1.default.string(),
    fixedAmount: joi_1.default.number(),
    minAmount: joi_1.default.number(),
    maxAmount: joi_1.default.number(),
    type: joi_1.default.string().valid("SWIFT_LOAN", "PEER_TO_PEER_LOAN").max(100),
    interest: joi_1.default.number(),
    maturityTime: joi_1.default.string(),
});
exports.getContractSchema = joi_1.default.object({
    contractId: joi_1.default.string().required().max(1000),
});
exports.signContractSchema = joi_1.default.object({
    contractId: joi_1.default.string().required().max(1000),
    amount: joi_1.default.number().required()
});
//# sourceMappingURL=contract.js.map