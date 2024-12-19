"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeRefreshToken = exports.renewRefreshToken = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
const celebrate_1 = require("celebrate");
const config_1 = __importDefault(require("../../../config"));
const renewRefreshToken = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    try {
        logger.debug('Getting refresh token...');
        //const token = req.cookies['user-id'];
        const token = req.get('reftoken');
        console.log("refresh token: ", token);
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const { clientTokenVersion, tokenVersion, user } = await authServiceInstance.decodeRefreshToken({ token });
        if (tokenVersion !== clientTokenVersion) {
            logger.debug(' Client token previously revoked, stopping execution...');
            res.clearCookie('user-id');
            return res
                .status(400)
                .send({ success: false, data: {}, message: 'Token is no longer valid, please sign in again' });
        }
        logger.debug('Renewing tokens for user: %s', user._id);
        const { accessToken, refreshToken } = await authServiceInstance.RenewRefreshToken({ user });
        res.cookie('user-id', refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            secure: config_1.default.environment !== 'development',
        });
        return res.status(200).json({
            success: true,
            data: {
                user: req.currentUser,
                token: accessToken,
                refreshToken,
            },
            message: '',
        });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
exports.renewRefreshToken = renewRefreshToken;
const revokeRefreshToken = async (req, res, next) => {
    (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object({
            verifyPassword: celebrate_1.Joi.string().required(),
        }),
    });
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Revoke-Token endpoint with userId: %s', req.currentUser._id);
    try {
        const { verifyPassword } = req.body;
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.RevokeRefreshTokens({ verifyPassword, userId: req.currentUser._id });
        res.clearCookie('user-id');
        return res.status(200).json({ success: true, data: {}, message: result });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
exports.revokeRefreshToken = revokeRefreshToken;
//# sourceMappingURL=index.js.map