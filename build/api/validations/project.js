"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectSchema = exports.updateProjectSchema = exports.startProjectSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.startProjectSchema = joi_1.default.object({
    projectName: joi_1.default.string().required().max(100),
    projectDescription: joi_1.default.string().required().min(100).max(5000),
    marketId: joi_1.default.string().required().max(1000),
    projectCategory: joi_1.default.string(),
    projectType: joi_1.default.string().valid("STARTUP", "OFFICIAL").max(100),
});
exports.updateProjectSchema = joi_1.default.object({
    projectId: joi_1.default.string().required(),
    projectName: joi_1.default.string().max(100),
    projectDescription: joi_1.default.string().min(100).max(5000),
    marketId: joi_1.default.string().max(1000),
    projectCategory: joi_1.default.string(),
    projectType: joi_1.default.string().valid("STARTUP", "OFFICIAL").max(100),
});
exports.deleteProjectSchema = joi_1.default.object({
    projectId: joi_1.default.string().required(),
});
//# sourceMappingURL=project.js.map