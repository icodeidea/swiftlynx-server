"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../../middlewares"));
const controllers_1 = require("../../controllers");
const { getTransactions } = controllers_1.TransactionController;
const transactionRouter = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/transaction', transactionRouter);
    //get transactions
    transactionRouter.route('/list').get(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, getTransactions);
    return app;
};
//# sourceMappingURL=index.js.map