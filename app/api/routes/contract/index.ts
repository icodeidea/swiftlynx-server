import { Router } from 'express'
import middlewares, { validator } from '../../middlewares';
import { ContractController } from '../../controllers'

const { 
    addContract, 
    getContract, 
    signContract ,
    updateContract,
    deleteContract
} = ContractController;

const contractRouter = Router();

export default (app: Router): Router => {
  app.use('/contract', contractRouter);

  //add contract
  contractRouter.route('/add-contract').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.addContract, addContract);

  //update contract
  contractRouter.route('/update').put(middlewares.isAuth, middlewares.attachCurrentUser, validator.updateContract, updateContract);

  //delete contract
  contractRouter.route('/delete').delete(middlewares.isAuth, middlewares.attachCurrentUser, validator.deleteContract, deleteContract);

  //list contract
  contractRouter.route('/list-contract').get(getContract);

  //sign contract
  contractRouter.route('/sign-contract').post(middlewares.isAuth, middlewares.attachCurrentUser, validator.signContract, signContract);

  return app;
};
