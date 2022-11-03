"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyEmailSchema = exports.userUpdateSchema = exports.authedUpdatePasswordSchema = exports.updatePasswordSchema = exports.signinSchema = exports.OAuthSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    referer: joi_1.default.string(),
});
exports.OAuthSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    refCode: joi_1.default.string(),
});
exports.signinSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string(),
});
exports.updatePasswordSchema = joi_1.default.object({
    password: joi_1.default.string().required(),
});
exports.authedUpdatePasswordSchema = joi_1.default.object({
    current: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
exports.userUpdateSchema = joi_1.default.object({
    username: joi_1.default.string(),
    dateOfBirth: joi_1.default.date(),
    country: joi_1.default.string(),
    region: joi_1.default.string(),
});
exports.onlyEmailSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
});
//# sourceMappingURL=auth.js.map