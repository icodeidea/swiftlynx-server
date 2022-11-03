"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
const typedi_1 = require("typedi");
const utils_1 = require("../../../../utils");
const sendToken_1 = require("../lib/sendToken");
const sendToken = async ({ amount, address }) => {
    const logger = typedi_1.Container.get('logger');
    try {
        return await (0, sendToken_1.send_token)(process.env.TOKEN_CONTRACT_ADDRESS, amount, address, process.env.ETH_WALLET_ADDRESS, process.env.EHTHER_WALLET_PRIVATE_KEY);
    }
    catch (e) {
        console.log("Error Ether Driver", e);
        // logger.error('🔥 error: %o', e);
        throw new utils_1.SystemError(200, "Can't process your payment at the moment");
        // throw new Error(e.message);
    }
};
exports.sendToken = sendToken;
//# sourceMappingURL=transaction.js.map