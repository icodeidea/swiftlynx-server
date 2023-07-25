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
const { addContract, getContract, signContract, updateContract, deleteContract, getAllContract, requestPaymentConfrimation } = controllers_1.ContractController;
const contractRouter = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/contract', contractRouter);
    //add contract
    contractRouter.route('/add-contract').post(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, middlewares_1.validator.addContract, addContract);
    //update contract
    contractRouter.route('/update').put(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, middlewares_1.validator.updateContract, updateContract);
    //delete contract
    contractRouter.route('/delete').delete(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, middlewares_1.validator.deleteContract, deleteContract);
    contractRouter.route('/request-payment-confirmation').get(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, requestPaymentConfrimation);
    //list contract
    contractRouter.route('/list-contract').get(getContract);
    //list all contract
    contractRouter.route('/list-all-contract').get(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, getAllContract);
    //sign contract
    contractRouter.route('/sign-contract').post(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, middlewares_1.validator.signContract, signContract);
    return app;
};
//# sourceMappingURL=index.js.map