"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class TransactionController {
}
exports.TransactionController = TransactionController;
_a = TransactionController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TransactionController.getTransactions = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get transactions endpoint');
    try {
        const transactionServiceInstance = typedi_1.Container.get(services_1.TransactionService);
        const data = await transactionServiceInstance.getTransactions(req.currentUser.id);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map