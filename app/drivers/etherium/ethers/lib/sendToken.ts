import { ethers } from 'ethers';
import { SystemError } from '../../../../utils';
import ABI from '../erc-token-abi';

export const send_token = async (
    contract_address,
    send_token_amount,
    to_address,
    send_account,
    private_key
  ) => {
    
    try {
        
        /**
         * smart contract abi file configuration
         */
        
        //TODO: move this to an env variable
        // const network = await ethers.getDefaultProvider('https://apis.ankr.com/eb9a13d6aa0842d9a53f92b5e6e36f72/fea9bb366590c1a292c5c3dfc1355a0e/binance/full/test'); //new ethers.providers.InfuraProvider("ropsten");
        const network = await new ethers.providers.JsonRpcProvider(
            process.env.ETHERIUM_NETWORK
        )
        const wallet = await new ethers.Wallet(private_key);
        const walletSigner = await wallet.connect(network);

        const currentGasPrice = await network.getGasPrice();
        const gas_price = ethers.utils.hexlify(parseInt(currentGasPrice._hex, 16));

        console.log(`gas_price: ${gas_price}`);

        const tnxCount = await network.getTransactionCount(send_account);
        console.log("TransactionCount", tnxCount);

        // general token send
        const contract = new ethers.Contract(
            contract_address,
            ABI,
            walletSigner,
        );

        // How many tokens?
        const numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18);
        console.log(`numberOfTokens: ${numberOfTokens}`);

        // Send tokens
        const tnx = await contract.transfer(to_address, numberOfTokens);
        console.log("Tnx:", tnx);

        return tnx;
    }  catch (e) {
        console.log("Transfer Token Error", e.reason);
        // logger.error('🔥 error: %o', e);
        throw new SystemError(200, "Can't process your payment at the moment");
        // throw new Error(e.message);
    }  
  }