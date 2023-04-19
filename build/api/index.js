"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const feed_1 = __importDefault(require("./routes/feed"));
const comment_1 = __importDefault(require("./routes/comment"));
const transaction_1 = __importDefault(require("./routes/transaction"));
const wallet_1 = __importDefault(require("./routes/wallet"));
const market_1 = __importDefault(require("./routes/market"));
const project_1 = __importDefault(require("./routes/project"));
const contract_1 = __importDefault(require("./routes/contract"));
const trade_1 = __importDefault(require("./routes/trade"));
const safe_1 = __importDefault(require("./routes/safe"));
// guaranteed to get dependencies
exports.default = () => {
    const app = (0, express_1.Router)();
    (0, auth_1.default)(app);
    (0, user_1.default)(app);
    (0, feed_1.default)(app);
    (0, comment_1.default)(app);
    (0, transaction_1.default)(app);
    (0, wallet_1.default)(app);
    (0, market_1.default)(app);
    (0, project_1.default)(app);
    (0, contract_1.default)(app);
    (0, trade_1.default)(app);
    (0, safe_1.default)(app);
    return app;
};
//# sourceMappingURL=index.js.map