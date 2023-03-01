"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyEmailSchema = exports.userUpdateSchema = exports.authedUpdatePasswordSchema = exports.updatePasswordSchema = exports.signinSchema = exports.OAuthSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const joi_password_complexity_1 = __importDefault(require("joi-password-complexity"));
exports.signupSchema = joi_1.default.object({
    firstname: joi_1.default.string().required(),
    lastname: joi_1.default.string().required(),
    accountType: joi_1.default.string().valid('individual', 'organisation').required(),
    email: joi_1.default.string().email().required(),
    password: (0, joi_password_complexity_1.default)(),
    username: joi_1.default.string().required(),
    dob: joi_1.default.date(),
    gender: joi_1.default.string(),
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
    newPassword: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    logOtherDevicesOut: joi_1.default.boolean()
});
exports.userUpdateSchema = joi_1.default.object({
    firstname: joi_1.default.string(),
    lastname: joi_1.default.string(),
    dob: joi_1.default.date(),
    gender: joi_1.default.string(),
    country: joi_1.default.string(),
});
exports.onlyEmailSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
});
//# sourceMappingURL=auth.js.map