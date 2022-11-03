"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
exports.default = async () => {
    const { connection } = await mongoose_1.default.connect(config_1.default.databaseURL);
    return connection;
    // const connection = await mongoose.createConnection(config.databaseURL);
    // return connection;
};
//# sourceMappingURL=mongoose.js.map