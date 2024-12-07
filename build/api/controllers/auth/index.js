"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
const config_1 = __importDefault(require("../../../config"));
class AuthController {
    static async resendVerification(req, res, next) {
        const logger = typedi_1.Container.get('logger');
        logger.debug('verifying: %s', req.params.token);
        try {
            const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
            const result = await authServiceInstance.ResendVerification({ userId: req.currentUser.id });
            return res.status(201).json({ success: true, data: {}, message: result });
        }
        catch (e) {
            logger.error('🔥 error %o', e);
            return next(e);
        }
    }
}
exports.AuthController = AuthController;
_a = AuthController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
AuthController.signup = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const message = await authServiceInstance.SignUp(req.body);
        return res.status(201).json({ success: true, data: {}, message: 'sign up successful' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
AuthController.signin = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Sign-In endpoint with body: %o', req.body);
    try {
        const { email, password } = req.body;
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const { user, accessToken, refreshToken, wallet } = await authServiceInstance.SignIn({ email, password });
        res.cookie('user-id', refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            secure: config_1.default.environment !== 'development',
        });
        return res
            .status(200)
            .json({ success: true, data: { user, token: accessToken, refreshToken, wallet }, message: '' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
AuthController.googleAuth = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Google Auth endpoint with body: %o', req.body);
    try {
        const referer = req.query.ref || false;
        if (referer)
            req.body.refCode = referer;
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const { user, accessToken, refreshToken, wallet } = await authServiceInstance.GoogleAuth(req.body);
        res.cookie('user-id', refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            secure: config_1.default.environment !== 'development',
        });
        return res
            .status(200)
            .json({ success: true, data: { user, token: accessToken, refreshToken, wallet }, message: '' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
AuthController.signout = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    try {
        res.clearCookie('user-id');
        return res
            .status(200)
            .json({ success: true, data: {}, message: 'You have successfully signed out. See you again soon' });
    }
    catch (e) {
        logger.error('🔥 error %o', e);
        return next(e);
    }
};
AuthController.verifyEmail = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('verifying: %s', req.params.token);
    try {
        console.log(req);
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.VerifyMail({
            token: req.params.token,
            email: req.params.email,
            type: req.params.type
        });
        return res.status(200).json({ success: true, data: result, message: "Your email has now been verified. Thank you for using our service" });
    }
    catch (e) {
        logger.error('🔥 error %o', e);
        return next(e);
    }
};
AuthController.resendVerificationMail = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('verifying: %s', req.body.email);
    logger.debug('resending: %s', req.params.type);
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.ResendVerificationMail(req.body.email, req.params.type);
        return res.status(201).json({ success: true, data: {}, message: result });
    }
    catch (e) {
        logger.error('🔥 error %o', e);
        return next(e);
    }
};
AuthController.requestPasswordReset = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    try {
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.RequestPasswordReset(req.body.email);
        return res.status(201).json({ success: true, data: {}, message: result });
    }
    catch (e) {
        logger.error('🔥 error %o', e);
        return next(e);
    }
};
AuthController.updatePassword = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    try {
        const token = req.params.token;
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.UpdatePassword(token, req.body.password);
        return res.status(201).json({ success: true, data: {}, message: result });
    }
    catch (e) {
        logger.error('🔥 error %o', e);
        return next(e);
    }
};
AuthController.authedUpdatePassword = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    try {
        const { current, password } = req.body;
        const authServiceInstance = typedi_1.Container.get(services_1.AuthService);
        const result = await authServiceInstance.AuthedUpdatePassword(req.currentUser.id, current, password);
        return res.status(201).json({ success: true, data: {}, message: result });
    }
    catch (e) {
        logger.error('🔥 error %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map