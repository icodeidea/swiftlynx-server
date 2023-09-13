"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
const utils_1 = require("../../../utils");
class TradeController {
}
exports.TradeController = TradeController;
_a = TradeController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TradeController.getTrades = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get trades endpoint');
    try {
        const entityId = req.currentUser.id;
        console.log(entityId);
        const tradeServiceInstance = typedi_1.Container.get(services_1.TradeService);
        const data = await tradeServiceInstance.getTrades(entityId);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TradeController.startTrade = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling start trade endpoint');
    try {
        const interest = {
            '6': 10,
            '12': 15
        };
        const tradeInput = {
            userId: req.currentUser.id,
            projectId: req.currentUser.id,
            contractId: req.currentUser.id,
            type: 'SWIFT_TRADE',
            status: 'PENDING',
            amount: req.body.amount,
            interest: interest[req.body.month],
            startDate: new Date(),
            endDate: (0, utils_1.getDateOfMonthsFromNow)(req.body.month),
        };
        const tradeServiceInstance = typedi_1.Container.get(services_1.TradeService);
        const data = await tradeServiceInstance.startTrade(tradeInput);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TradeController.filterTrades = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling filter trades endpoint');
    try {
        const tradeServiceInstance = typedi_1.Container.get(services_1.TradeService);
        const data = await tradeServiceInstance.filter(req.params.status);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map