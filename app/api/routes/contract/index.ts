import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { ContractController } from '../../controllers'

const { 
    addContract, 
    getContract, 
    signContract ,
    updateContract,
    updateContractState,
    deleteContract,
    getAllContract,
    filterAllContract,
    requestPaymentConfrimation
} = ContractController;

const contractRouter = Router();

export default (app: Router): Router => {
  app.use('/contract', contractRouter);

  //add contract
  contractRouter.route('/add-contract').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.addContract, addContract);

  //update contract
  contractRouter.route('/update').put(middlewares.isAuth, middlewares.attachCurrentUser, validator.updateContract, updateContract);

  //update contract state
  contractRouter.route('/update-state').put(validator.updateContract, updateContractState);

  //delete contract
  contractRouter.route('/delete').delete(middlewares.isAuth, middlewares.attachCurrentUser, validator.deleteContract, deleteContract);

  contractRouter.route('/request-payment-confirmation').get(middlewares.isAuth, middlewares.attachCurrentUser, requestPaymentConfrimation);

  //list contract
  contractRouter.route('/list-contract').get(getContract);

  //list all contract
  contractRouter.route('/list-all-contract').get(middlewares.isAuth, middlewares.attachCurrentUser, getAllContract);

  //filter contracts
  contractRouter.route('/filter-contracts/:state').get(filterAllContract);

  //sign contract
  contractRouter.route('/sign-contract').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.signContract, signContract);

  return app;
};
