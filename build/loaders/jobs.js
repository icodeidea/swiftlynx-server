"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const config_1 = __importDefault(require("../config"));
exports.default = ({ agenda }) => {
    agenda.define('send-email', { priority: 10, concurrency: config_1.default.agenda.concurrency });
    agenda.start();
};
//# sourceMappingURL=jobs.js.map