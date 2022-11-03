"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = __importDefault(require("express-jwt"));
const config_1 = __importDefault(require("../../config"));
/**
 * JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 */
const getTokenFromHeader = req => {
    const token = req.get('authorization');
    if (!token) {
        return null;
    }
    return token.substring(7);
};
const isAuth = (0, express_jwt_1.default)({
    secret: config_1.default.jwtSecret,
    algorithms: [config_1.default.jwtAlgorithm],
    userProperty: 'token',
    getToken: getTokenFromHeader, // How to extract the JWT from the request
});
exports.default = isAuth;
//# sourceMappingURL=isAuth.js.map