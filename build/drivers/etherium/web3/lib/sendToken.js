"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_token = void 0;
const tx_1 = require("@ethereumjs/tx");
const common_1 = __importDefault(require("@ethereumjs/common"));
const web3_1 = __importDefault(require("web3"));
const erc_token_abi_1 = __importDefault(require("./erc-token-abi"));
const utils_1 = require("../../../../utils");
const send_token = async (contract_address, send_token_amount, to_address, send_account, private_key) => {
    try {
        const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(process.env.ETHERIUM_NETWORK));
        // set token source, destination and amount
        const myAddress = send_account;
        const toAddress = to_address;
        const amount = web3.utils.toHex(send_token_amount);
        const gasPrice = await web3.utils.toHex(await web3.eth.getGasPrice()) || 10000000000;
        const getChainId = await web3.eth.getChainId();
        // get transaction count, later will used as nonce
        const count = await web3.eth.getTransactionCount(myAddress, 'pending');
        console.log("Transaction count", count);
        // setting private key here, will sign the transaction below
        const privateKey = Buffer.from(private_key, 'hex');
        // const privateKey = private_key;
        // Get abi array here https://etherscan.io/address/0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0#code
        const abiArray = JSON.parse(erc_token_abi_1.default);
        const contractAddress = contract_address;
        const contract = await new web3.eth.Contract(abiArray, contractAddress, { from: myAddress });
        const contractTransfer = await contract.methods.transfer(toAddress, amount).encodeABI();
        console.log("transfer", contractTransfer);
        console.log("gasPrice", gasPrice);
        console.log("gasLimit", web3.utils.toHex(210000));
        const rawTransaction = {
            // "chainId": web3.utils.toHex(getChainId),
            "chainId": getChainId,
            "nonce": web3.utils.toHex(count),
            "from": myAddress,
            "gasPrice": gasPrice,
            "gas": web3.utils.toHex(350000),
            "to": contract_address,
            "value": "0x0",
            "data": contractTransfer,
            "r": myAddress,
            "s": toAddress,
            "v": 230
        };
        const BSC_MAIN = common_1.default.custom({
            name: 'bnb',
            networkId: getChainId,
            chainId: getChainId,
        });
        const transaction = await new tx_1.Transaction(rawTransaction, { common: BSC_MAIN });
        transaction.sign(privateKey);
        web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));
        // check the balance
        const balance = await contract.methods.balanceOf(myAddress).call();
        console.log("balance", balance);
        console.log("tnx", transaction);
        return transaction;
    }
    catch (e) {
        console.log("Transfer Token Error", e.reason);
        // logger.error('🔥 error: %o', e);
        throw new utils_1.SystemError(200, "Can't process your payment at the moment");
        // throw new Error(e.message);
    }
};
exports.send_token = send_token;
//# sourceMappingURL=sendToken.js.map