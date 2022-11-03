"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMarketSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addMarketSchema = joi_1.default.object({
    marketName: joi_1.default.string().required().max(100),
    sectorAvailable: joi_1.default.string().valid("INVESTMENT", "LOAN", "ALL").required().max(100),
});
//# sourceMappingURL=market.js.map