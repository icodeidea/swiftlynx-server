import {Transaction as Tx} from '@ethereumjs/tx';
import Common, { Chain } from '@ethereumjs/common';
import Web3 from 'web3';
import ABI from './erc-token-abi';
import { SystemError } from '../../../../utils';

export const send_token = async (
    contract_address,
    send_token_amount,
    to_address,
    send_account,
    private_key
  ) => {
    
    try {

        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHERIUM_NETWORK));

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
        const abiArray = JSON.parse(ABI);

        const contractAddress = contract_address;
        const contract = await new web3.eth.Contract(abiArray, contractAddress, {from: myAddress});
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
            "value":"0x0",
            "data": contractTransfer,
            "r": myAddress,
            "s": toAddress,
            "v": 230
        }

        const BSC_MAIN = Common.custom({
                name: 'bnb',
                networkId: getChainId, 
                chainId: getChainId,
            }
        )

        const transaction = await new Tx(rawTransaction, {common: BSC_MAIN});
        transaction.sign(privateKey);

        web3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'));

        // check the balance
        const balance = await contract.methods.balanceOf(myAddress).call();
        console.log("balance", balance);

        console.log("tnx", transaction);

        return transaction;

    }  catch (e) {
        console.log("Transfer Token Error", e.reason);
        // logger.error('🔥 error: %o', e);
        throw new SystemError(200, "Can't process your payment at the moment");
        // throw new Error(e.message);
    }
    
    
  }