"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importStar(require("../../middlewares"));
const controllers_1 = require("../../controllers");
// import { signin, signout, signup, renewRefreshToken, revokeRefreshToken } from '../controllers';
const authRouter = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/auth', authRouter);
    //signup
    authRouter.route('/signup').post(middlewares_1.validator.signup, controllers_1.AuthController.signup);
    //sigin
    authRouter.route('/signin').post(middlewares_1.validator.signin, controllers_1.AuthController.signin);
    //Google Auth
    authRouter.route('/googleAuth').post(middlewares_1.validator.OAuth, controllers_1.AuthController.googleAuth);
    //verifyMail
    authRouter.route('/verify/:token').get(controllers_1.AuthController.verifyEmail);
    authRouter.route('/reset').post(middlewares_1.validator.validateEmail, controllers_1.AuthController.requestPasswordReset);
    authRouter.route('/reset/:token').post(middlewares_1.validator.validatePassword, controllers_1.AuthController.updatePassword);
    authRouter.route('/resetPassword').post(middlewares_1.validator.resetPassword, middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, controllers_1.AuthController.authedUpdatePassword);
    // resend verification mail replacement
    authRouter.route('/resend-verify-mail').post(middlewares_1.validator.validateEmail, controllers_1.AuthController.resendVerificationMail);
    // resendVerificationMail : depricated, didnt comment it out to avoid system break down
    authRouter
        .route('/resend-verify')
        .post(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, controllers_1.AuthController.resendVerification);
    //signout
    authRouter.route('/signout').post(controllers_1.AuthController.signout);
    //revoke-refresh
    authRouter.route('/revoke-refresh-token').post(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, controllers_1.revokeRefreshToken);
    //renew-refresh
    authRouter.route('/renew-refresh-token').post(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, controllers_1.renewRefreshToken);
    return app;
};
//# sourceMappingURL=index.js.map