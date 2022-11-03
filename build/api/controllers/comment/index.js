"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class CommentController {
}
exports.CommentController = CommentController;
_a = CommentController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
CommentController.write = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling write endpoint');
    try {
        const commentServiceInstance = typedi_1.Container.get(services_1.CommentService);
        const data = await commentServiceInstance.Write(req.body, req.currentUser.id);
        return res.status(201).json({ success: true, data, message: 'comment created' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
CommentController.read = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling read endpoint');
    try {
        const { feed } = req.query;
        const commentServiceInstance = typedi_1.Container.get(services_1.CommentService);
        const data = await commentServiceInstance.Read(feed || false);
        console.log(data);
        return res.status(201).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
CommentController.deleteComment = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling delete endpoint');
    try {
        const commentId = req.params.id;
        const feedServiceInstance = typedi_1.Container.get(services_1.CommentService);
        const data = await feedServiceInstance.Delete({ commentId });
        return res.status(200).json({ success: true, data, message: 'data retrived' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map