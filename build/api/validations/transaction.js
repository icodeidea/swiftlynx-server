"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPaymentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.initPaymentSchema = joi_1.default.object({
    amount: joi_1.default.string().required(),
    entityId: joi_1.default.string().required(),
    entity: joi_1.default.string().required().valid('contract', 'safe', 'trade'),
});
//# sourceMappingURL=transaction.js.map