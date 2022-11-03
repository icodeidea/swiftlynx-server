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
exports.ActivityService = void 0;
const typedi_1 = require("typedi");
const eventDispatcher_1 = require("../../decorators/eventDispatcher");
const utils_1 = require("../../utils");
let ActivityService = class ActivityService {
    constructor(activityModel, logger, eventDispatcher) {
        this.activityModel = activityModel;
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
    }
    async addActivity(activityInputDTO) {
        try {
            const activityRecord = await this.activityModel.create(Object.assign({}, activityInputDTO));
            return 'activity added';
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async recentActivity() {
        try {
            return await this.activityModel.find().populate('User', 'username picture').sort('createdAt');
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async Delete({ activityId, }) {
        this.logger.silly('Deleting Activity...');
        try {
            const activityDeleted = await this.activityModel.findByIdAndDelete(activityId);
            if (activityDeleted) {
                this.logger.silly('Activity deleted!');
                return 'activity  deleted';
            }
            else {
                throw new Error('this activity is unable to delete at the moment, please try again later');
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
ActivityService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('activityModel')),
    __param(1, (0, typedi_1.Inject)('logger')),
    __param(2, (0, eventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [Object, Object, eventDispatcher_1.EventDispatcherInterface])
], ActivityService);
exports.ActivityService = ActivityService;
//# sourceMappingURL=index.js.map