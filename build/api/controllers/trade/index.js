"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class TradeController {
}
exports.TradeController = TradeController;
_a = TradeController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
TradeController.getTrades = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get trades endpoint');
    try {
        const entityId = req.query.entityId || req.currentUser.id;
        const tradeServiceInstance = typedi_1.Container.get(services_1.TradeService);
        const data = await tradeServiceInstance.getTrades(entityId);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map