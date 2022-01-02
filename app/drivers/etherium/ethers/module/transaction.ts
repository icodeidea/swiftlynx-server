import { Response } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { ethers } from 'ethers';
import { ITransactionInputDTO } from '../../../../interfaces';
import { SystemError } from '../../../../utils';
import { send_token } from '../lib/sendToken';

export const sendToken = async ({amount, address} : {amount: number, address: string}): Promise<any> => {
  const logger: Logger = Container.get('logger');
  try {
    return await send_token(
      process.env.TOKEN_CONTRACT_ADDRESS,
      amount,
      address,
      process.env.ETH_WALLET_ADDRESS,
      process.env.EHTHER_WALLET_PRIVATE_KEY
    )
  } catch (e) {
    console.log("Error Ether Driver", e);
    // logger.error('🔥 error: %o', e);
    throw new SystemError(200, "Can't process your payment at the moment");
    // throw new Error(e.message);
  }
}

export const sendEther = async ({amount, address} : {amount: number, address: string}): Promise<any> => {
    const logger: Logger = Container.get('logger');
    try {
      
      // network: using the Rinkeby testnet
      const network = process.env.ETHERIUM_NETWORK;

      // provider: Infura or Etherscan will be automatically chosen
      const provider = ethers.getDefaultProvider(network);

      // Sender private key: 
      // correspondence address 0xb985d345c4bb8121cE2d18583b2a28e98D56d04b
      const privateKey = process.env.EHTHER_WALLET_PRIVATE_KEY;

      // Create a wallet instance
      const wallet = new ethers.Wallet(privateKey, provider);

      // Receiver Address which receives BNG
      const receiverAddress = address;

      // Ether amount to send
      const amountInEther = amount;

      // set gasPrice
      const currentGasPrice = await provider.getGasPrice();
      const gas_price = ethers.utils.hexlify(parseInt(currentGasPrice._hex, 16))

      // set gasLimit
      const gas_limit = "0x100000";

      // Create a transaction object
      const tx = {
          from: process.env.ETH_WALLET_ADDRESS,
          to: receiverAddress,
          // Convert currency unit from ether to wei
          value: ethers.utils.parseEther(`${amountInEther}`),
          nonce: await provider.getTransactionCount(
            process.env.ETH_WALLET_ADDRESS,
            "latest"
          ),
          gasLimit: ethers.utils.hexlify(gas_limit), // 100000
          gasPrice: gas_price,
          // This ensures the transaction cannot be replayed on different networks
          chainId: await wallet.getChainId()
      };

      const signedTnx = await wallet.signTransaction(tx);

      // Send a transaction
      const tnx = await provider.sendTransaction(signedTnx);
      // .then((txObj) => {
      //     console.log('txHash', txObj.hash)
      //     // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
      //     // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
      // });
      console.log('tnx', tnx);

      logger.debug('transactions fetched');
      
      return tnx;
    } catch (e) {
      console.log("Error Ether Driver", e.reason);
      // logger.error('🔥 error: %o', e);
      throw new SystemError(200, "Can't process your payment at the moment");
      // throw new Error(e.message);
    }
  };