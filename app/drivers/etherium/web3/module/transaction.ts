import { Container } from 'typedi';
import { Logger } from 'winston';
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