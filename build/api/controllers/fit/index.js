"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FitController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class FitController {
}
exports.FitController = FitController;
_a = FitController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
FitController.createFit = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling create fit endpoint');
    try {
        const fitServiceInstance = typedi_1.Container.get(services_1.FitService);
        const data = await fitServiceInstance.saveFit(req.body);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
FitController.filterFits = async (req, res, next) => {
    var _b;
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling filter fits endpoint');
    try {
        const fitServiceInstance = typedi_1.Container.get(services_1.FitService);
        const data = await fitServiceInstance.filter(req.params.status, (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.branch);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
FitController.updateFitState = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Update Fit with userId');
    try {
        // req.body.userId = req.currentUser.id;
        const fitServiceInstance = typedi_1.Container.get(services_1.FitService);
        const data = await fitServiceInstance.updateFitStatus({ fitId: req.body.fitId, state: req.body.state });
        return res.status(201).json({ success: true, data, message: 'fit updated successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map