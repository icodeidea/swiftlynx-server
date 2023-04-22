"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystack = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const baseURL = 'https://api.paystack.co';
const request = async ({ url, body = {}, method = 'get' }) => {
    const { PAYSTACK_SECRET_KEY } = process.env;
    try {
        let response = await (0, node_fetch_1.default)(`${baseURL}/${url}`, {
            body: Object.keys(body).length ? JSON.stringify(body) : undefined,
            method,
            headers: {
                authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
        });
        response = await response.json();
        return response;
    }
    catch (error) {
        return {
            status: false,
            message: 'An error occured calling paystack',
        };
    }
};
const paystack = () => {
    const initializePayment = async (form) => {
        const { status, message, data } = await request({
            url: 'transaction/initialize',
            body: form,
            method: 'post'
        });
        return { status, message, data };
    };
    const verifyPayment = async (ref) => {
        const { status, message, data } = await request({
            url: `transaction/verify/${encodeURIComponent(ref)}`,
            method: 'post'
        });
        return { status, message, data };
    };
    return { initializePayment, verifyPayment };
};
exports.paystack = paystack;
//# sourceMappingURL=index.js.map