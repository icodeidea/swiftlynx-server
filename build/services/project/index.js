"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const typedi_1 = require("typedi");
const utils_1 = require("../../utils");
const market_1 = require("../market");
let ProjectService = class ProjectService {
    constructor(projectModel, logger, market) {
        this.projectModel = projectModel;
        this.logger = logger;
        this.market = market;
    }
    async startProject(project) {
        try {
            this.logger.silly('creating project');
            const createdProject = await this.projectModel.create({
                userId: project.userId,
                marketId: project.marketId,
                projectName: project.projectName,
                projectDescription: project.projectDescription,
                projectBanner: '',
                projectType: project.projectType,
            });
            await this.market.updateMarketStatistics({
                marketId: project.marketId,
                statistics: { projectCount: 1 }
            });
            return createdProject;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getProject(projectId) {
        try {
            this.logger.silly('getting project record');
            console.log('projectId', projectId);
            if (!projectId || projectId === null)
                return await this.projectModel.find();
            const projectRecord = await this.projectModel
                .find({ $or: [
                    // { '_id': projectId },
                    { 'marketId': projectId },
                    { 'userId': projectId },
                ] });
            return projectRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateProjectStatistics(data) {
        try {
            this.logger.silly('updating project statistics');
            const { projectId, statistics } = data;
            const projectRecord = await this.projectModel
                .findOne({ 'id': projectId });
            for (const property in statistics) {
                projectRecord[property] = projectRecord[property] + statistics[property];
            }
            await projectRecord.save();
            await this.market.updateMarketStatistics({
                marketId: projectRecord.marketId,
                statistics: Object.assign({}, data.statistics)
            });
            return projectRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateProject(updateProject) {
        try {
            this.logger.silly('updating project');
            const userId = updateProject.userId;
            const projectId = updateProject.projectId;
            delete updateProject.userId;
            delete updateProject.projectId;
            const projectRecord = await this.projectModel.findOne({ 'id': projectId, userId });
            if (!projectRecord) {
                this.logger.silly('project not found');
                throw new utils_1.SystemError(200, 'project not found');
            }
            for (const property in updateProject) {
                projectRecord[property] = updateProject[property];
            }
            return await projectRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async deleteProject({ userId, projectId }) {
        this.logger.silly('Deleting Project...');
        try {
            const projectRecord = await this.projectModel
                .findOne({ 'id': projectId, userId });
            if (!projectRecord) {
                throw new Error('project not found');
            }
            const projectDeleted = await this.projectModel.findByIdAndDelete(projectId);
            if (projectDeleted) {
                this.logger.silly('Project deleted!');
                return 'this project is permanently deleted';
            }
            else {
                throw new Error('this project is unable to delete at the moment, please try again later');
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
ProjectService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('projectModel')),
    __param(1, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object, market_1.MarketService])
], ProjectService);
exports.ProjectService = ProjectService;
//# sourceMappingURL=index.js.map