"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchTransaction = exports.getBlockHeight = void 0;
const typedi_1 = require("typedi");
const curl_1 = __importDefault(require("../lib/curl"));
const getBlockHeight = async () => {
    const logger = typedi_1.Container.get('logger');
    const etheriumServiceInstance = typedi_1.Container.get(curl_1.default);
    try {
        const options = {
            module: "proxy",
            action: "eth_blockNumber"
        };
        const block = await etheriumServiceInstance.GetEndpointsWithPrefix({
            data: options
        });
        logger.debug('transactions fetched');
        return block.data;
    }
    catch (e) {
        console.log(e);
        logger.error('🔥 error: %o', e);
        throw new Error(e.message);
    }
};
exports.getBlockHeight = getBlockHeight;
const FetchTransaction = async () => {
    const logger = typedi_1.Container.get('logger');
    const etheriumServiceInstance = typedi_1.Container.get(curl_1.default);
    try {
        const { result } = await (0, exports.getBlockHeight)();
        const startBlock = (parseInt(result, 16) - 9000);
        console.log("block", parseInt(result, 16));
        console.log("startblock minus 3", startBlock);
        const options = {
            module: "account",
            action: "tokentx",
            contractaddress: process.env.TOKEN_CONTRACT_ADDRESS,
            page: 1,
            offset: 200,
            startblock: startBlock,
            endblock: 999999999999,
            sort: "asc"
        };
        const tx = await etheriumServiceInstance.GetEndpointsWithPrefix({
            data: options
        });
        logger.debug('transactions fetched');
        return tx.data;
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        throw new Error(e.message);
    }
};
exports.FetchTransaction = FetchTransaction;
//# sourceMappingURL=transaction.js.map