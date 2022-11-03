"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawalSchema = exports.activation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.activation = joi_1.default.object({
    address: joi_1.default.string().required(),
});
exports.withdrawalSchema = joi_1.default.object({
    address: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
});
//# sourceMappingURL=wallet.js.map