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
const { listMySafe, createSafe, filterSavings, updateSafeState } = controllers_1.SafeController;
const safeRouter = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/safe', safeRouter);
    //get safe list
    safeRouter.route('/list-safe').get(middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, listMySafe);
    //filter contracts
    safeRouter.route('/filter-savings/:status').get(filterSavings);
    //create safe
    safeRouter.route('/create-safe').post(middlewares_1.validator.createSafe, middlewares_1.default.isAuth, middlewares_1.default.attachCurrentUser, createSafe);
    //update safe state
    safeRouter.route('/update-state').put(middlewares_1.validator.updateSafe, updateSafeState);
    return app;
};
//# sourceMappingURL=index.js.map