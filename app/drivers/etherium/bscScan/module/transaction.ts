import { Response } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { ITransactionInputDTO } from '../../../../interfaces';
import EtheriumService from '../lib/curl';

export const getBlockHeight = async (): Promise<any> => {
    const logger: Logger = Container.get('logger');
    const etheriumServiceInstance = Container.get(EtheriumService);
    try {
      const options = {
        module: "proxy",
        action: "eth_blockNumber"
      };
      const block = await etheriumServiceInstance.GetEndpointsWithPrefix({
          data: options
      })
      logger.debug('transactions fetched');
      return block.data;
    } catch (e) {
      console.log(e);
      logger.error('🔥 error: %o', e);
      throw new Error(e.message);
    }
  };

export const FetchTransaction = async (): Promise<any> => {
  const logger: Logger = Container.get('logger');
  const etheriumServiceInstance = Container.get(EtheriumService);
  try {
    const { result } = await getBlockHeight();
    const startBlock = (parseInt(result, 16) - 9000);
    console.log("block", parseInt(result, 16));
    console.log("startblock minus 3",startBlock);
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
    })
    logger.debug('transactions fetched');
    return tx.data;
  } catch (e) {
    logger.error('🔥 error: %o', e);
    throw new Error(e.message);
  }
};