"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSafeSchema = exports.createSafeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createSafeSchema = joi_1.default.object({
    remark: joi_1.default.string().required(),
    goal: joi_1.default.string().required(),
});
exports.updateSafeSchema = joi_1.default.object({
    safeId: joi_1.default.string().required(),
    state: joi_1.default.string().required(),
});
//# sourceMappingURL=safe.js.map