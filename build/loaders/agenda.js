"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const es_1 = __importDefault(require("agenda/es"));
const config_1 = __importDefault(require("../config"));
exports.default = ({ mongoConnection }) => {
    return new es_1.default({
        mongo: mongoConnection,
        db: { address: config_1.default.agenda.dbCollection, collection: config_1.default.agenda.dbCollection },
        processEvery: config_1.default.agenda.pooltime,
        maxConcurrency: config_1.default.agenda.concurrency,
    });
    /**
     * This voodoo magic is proper from agenda.js so I'm not gonna explain too much here.
     * https://github.com/agenda/agenda#mongomongoclientinstance
     */
};
//# sourceMappingURL=agenda.js.map