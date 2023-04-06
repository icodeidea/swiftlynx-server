"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = __importDefault(require("../../middlewares"));
const controllers_1 = require("../../controllers");
const { getTrades } = controllers_1.TradeController;
const tradeRouter = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/trade', tradeRouter);
    //list trades
    tradeRouter.route('/list-trade').get(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, getTrades);
    return app;
};
//# sourceMappingURL=index.js.map