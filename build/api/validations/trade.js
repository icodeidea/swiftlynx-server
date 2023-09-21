"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTradeSchema = exports.startTradeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.startTradeSchema = joi_1.default.object({
    amount: joi_1.default.string().required(),
    month: joi_1.default.number().valid(6, 12).required(),
});
exports.updateTradeSchema = joi_1.default.object({
    tradeId: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
});
//# sourceMappingURL=trade.js.map