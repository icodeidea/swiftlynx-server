"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class FeedController {
}
exports.FeedController = FeedController;
_a = FeedController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
FeedController.write = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling write endpoint');
    try {
        const feedServiceInstance = typedi_1.Container.get(services_1.FeedService);
        const message = await feedServiceInstance.Write(req.body, req.currentUser.id);
        return res.status(201).json({ success: true, data: [], message: 'content created' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
FeedController.read = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling read endpoint');
    try {
        const { slug } = req.query;
        const feedServiceInstance = typedi_1.Container.get(services_1.FeedService);
        const data = await feedServiceInstance.Read(slug || false);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
FeedController.getFeedStackedData = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling getFeedStackedData endpoint');
    try {
        const { slug } = req.query;
        const feedServiceInstance = typedi_1.Container.get(services_1.FeedService);
        const activityServiceInstance = typedi_1.Container.get(services_1.ActivityService);
        const latest = await feedServiceInstance.Read(slug || false);
        const activity = await activityServiceInstance.recentActivity();
        return res.status(201).json({ success: true, data: { latest, activity }, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
FeedController.addReaction = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling add reaction endpoint');
    try {
        const feedServiceInstance = typedi_1.Container.get(services_1.FeedService);
        const data = await feedServiceInstance.AddReaction(req.body.feed, req.currentUser.id);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
FeedController.update = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling write endpoint');
    try {
        const feedId = req.params.id;
        const feedServiceInstance = typedi_1.Container.get(services_1.FeedService);
        const message = await feedServiceInstance.Update(req.body, feedId);
        return res.status(201).json({ success: true, data: [], message: 'content created' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
FeedController.deleteFeed = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling delete endpoint');
    try {
        const feedId = req.params.id;
        const feedServiceInstance = typedi_1.Container.get(services_1.FeedService);
        const data = await feedServiceInstance.Delete({ feedId });
        return res.status(200).json({ success: true, data, message: data });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map