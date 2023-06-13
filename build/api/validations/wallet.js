"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccountDetailSchema = exports.addAccountDetailSchema = exports.requestPayoutSchema = exports.withdrawalSchema = exports.activation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.activation = joi_1.default.object({
    address: joi_1.default.string().required(),
});
exports.withdrawalSchema = joi_1.default.object({
    address: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
});
exports.requestPayoutSchema = joi_1.default.object({
    entity: joi_1.default.string().valid('safe', 'Trade').required(),
    entityId: joi_1.default.string().required(),
    accountDetailId: joi_1.default.string().required(),
});
exports.addAccountDetailSchema = joi_1.default.object({
    accountName: joi_1.default.string().required(),
    accountNumber: joi_1.default.string().required(),
    bankname: joi_1.default.string().required(),
});
exports.deleteAccountDetailSchema = joi_1.default.object({
    accountDetailId: joi_1.default.string().required(),
});
//# sourceMappingURL=wallet.js.map