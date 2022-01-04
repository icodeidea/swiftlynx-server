import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import { ContractService } from '../../../services';
import { IContract, IContractInputDTO } from '../../../interfaces/';

export class ContractController {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static addContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling add contract endpoint');
    try {
      req.body.userId = req.currentUser.id;
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.addContract(req.body as IContractInputDTO);
      return res.status(201).json({ success: true, data, message: 'contract added successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static getContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling get contract endpoint');
    try {
      const contractIdOrProjectId = req.params.contractIdOrProjectId;
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.getContract(contractIdOrProjectId);
      return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static signContract = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling sign contract endpoint');
    try {
      const contractId = req.body.contractId;
      const contractServiceInstance = Container.get(ContractService);
      const data = await contractServiceInstance.getContract(contractId);
      return res.status(201).json({ success: true, data, message: 'contract signed successfully' });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };


}
