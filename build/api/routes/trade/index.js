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
const { getTrades, filterTrades, startTrade, updateTradeState } = controllers_1.TradeController;
const tradeRouter = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/trade', tradeRouter);
    //start trade
    tradeRouter.route('/start-trade').post(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, middlewares_1.validator.startTrade, startTrade);
    //list trades
    tradeRouter.route('/list-trade').get(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, getTrades);
    //filter trades
    tradeRouter.route('/filter-trades/:status').get(filterTrades);
    //update trade state
    tradeRouter.route('/update-state').put(middlewares_1.validator.updateTrade, updateTradeState);
    return app;
};
//# sourceMappingURL=index.js.map