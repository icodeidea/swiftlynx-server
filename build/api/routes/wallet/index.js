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
const { getWalletInfo, activateWallet, WithdrawFund } = controllers_1.WalletController;
const walletRouter = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/wallet', walletRouter);
    //get wallet info
    walletRouter.route('/info').get(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, getWalletInfo);
    //activate wallet
    walletRouter.route('/activate').post(middlewares_1.validator.walletActivation, middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, activateWallet);
    //withdraw  fund
    walletRouter.route('/withdraw-fund').post(middlewares_1.validator.withdrawFund, middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, WithdrawFund);
    return app;
};
//# sourceMappingURL=index.js.map