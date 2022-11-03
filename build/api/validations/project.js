"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startProjectSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.startProjectSchema = joi_1.default.object({
    projectName: joi_1.default.string().required().max(100),
    projectDescription: joi_1.default.string().required().max(100),
    marketId: joi_1.default.string().required().max(1000),
    projectType: joi_1.default.string().valid("STARTUP", "OFFICIAL").required().max(100),
});
//# sourceMappingURL=project.js.map