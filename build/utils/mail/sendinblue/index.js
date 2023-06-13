"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = void 0;
const __1 = require("../");
const node_fetch_1 = __importDefault(require("node-fetch"));
const send = async ({ to, subject, text = '', html = '', from = '', fromName = '' }) => {
    const { SENDINBLUE_API_KEY, EMAIL_FROM, EMAIL_NAME } = process.env;
    try {
        const body = {
            sender: { name: fromName || EMAIL_NAME, email: from || EMAIL_FROM },
            to: (0, __1.generateReciepient)(to),
            subject,
            htmlContent: html,
            textContent: text,
        };
        const response = await (0, node_fetch_1.default)('https://api.sendinblue.com/v3/smtp/email', {
            method: 'post',
            headers: {
                'api-key': SENDINBLUE_API_KEY,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify(body),
        });
        return response.status === 201;
    }
    catch (error) {
        return false;
    }
};
exports.send = send;
//# sourceMappingURL=index.js.map