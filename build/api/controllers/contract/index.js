"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class ContractController {
}
exports.ContractController = ContractController;
_a = ContractController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.addContract = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling add contract endpoint');
    try {
        req.body.userId = req.currentUser.id;
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.addContract(req.body);
        return res.status(201).json({ success: true, data, message: 'contract added successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.getContract = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get contract endpoint');
    try {
        const contractIdOrProjectId = req.params.contractIdOrProjectId;
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.getContract(contractIdOrProjectId);
        return res.status(201).json({ success: true, data, message: 'contract(s) retrived successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ContractController.signContract = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling sign contract endpoint');
    try {
        const contractId = req.body.contractId;
        const contractServiceInstance = typedi_1.Container.get(services_1.ContractService);
        const data = await contractServiceInstance.getContract(contractId);
        return res.status(201).json({ success: true, data, message: 'contract signed successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map