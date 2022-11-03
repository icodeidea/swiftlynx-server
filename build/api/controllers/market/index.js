"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class MarketController {
}
exports.MarketController = MarketController;
_a = MarketController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
MarketController.addMarket = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling add market endpoint');
    try {
        const marketServiceInstance = typedi_1.Container.get(services_1.MarketService);
        const data = await marketServiceInstance.addMarket(req.body);
        return res.status(201).json({ success: true, data, message: 'market added successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
MarketController.getMarket = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get market endpoint');
    try {
        const marketId = req.query.marketName || null;
        const marketServiceInstance = typedi_1.Container.get(services_1.MarketService);
        const data = await marketServiceInstance.getMarket(marketId);
        return res.status(201).json({ success: true, data, message: 'market retrived successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map