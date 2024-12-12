"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const typedi_1 = require("typedi");
const services_1 = require("../../../services");
class ProjectController {
}
exports.ProjectController = ProjectController;
_a = ProjectController;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ProjectController.startProject = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling start project endpoint');
    try {
        req.body.userId = req.currentUser.id;
        const projectServiceInstance = typedi_1.Container.get(services_1.ProjectService);
        const data = await projectServiceInstance.startProject(req.body);
        return res.status(201).json({ success: true, data, message: 'project started successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ProjectController.getProject = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get project endpoint');
    try {
        const projectId = req.query.projectName || null;
        const projectServiceInstance = typedi_1.Container.get(services_1.ProjectService);
        const data = await projectServiceInstance.getProject(projectId);
        return res.status(201).json({ success: true, data, message: 'project retrived successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
ProjectController.getFeaturedProjects = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling get featued project endpoint');
    try {
        const projectServiceInstance = typedi_1.Container.get(services_1.ProjectService);
        const data = await projectServiceInstance.getFeaturedProjects();
        return res.status(201).json({ success: true, data, message: 'featured project retrived successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
ProjectController.updateProject = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Update Project with userId: %s', req.currentUser.id);
    try {
        req.body.userId = req.currentUser.id;
        const projectServiceInstance = typedi_1.Container.get(services_1.ProjectService);
        const data = await projectServiceInstance.updateProject(req.body);
        return res.status(201).json({ success: true, data, message: 'project updated successfully' });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
ProjectController.deleteProject = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    logger.debug('Calling Delete Project with userId: %s', req.currentUser.id);
    try {
        const projectServiceInstance = typedi_1.Container.get(services_1.ProjectService);
        const result = await projectServiceInstance.deleteProject({ userId: req.currentUser.id, projectId: req.body.projectId });
        return res.status(200).json({ success: true, data: {}, message: result });
    }
    catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
    }
};
//# sourceMappingURL=index.js.map