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
exports.FitService = void 0;
const typedi_1 = require("typedi");
const utils_1 = require("../../utils");
let FitService = class FitService {
    constructor(fitModel, logger) {
        this.fitModel = fitModel;
        this.logger = logger;
    }
    async saveFit(fit) {
        try {
            this.logger.silly('creating fit');
            const createdFit = await this.fitModel.create(Object.assign({}, fit));
            return createdFit;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async filter(status, branch) {
        try {
            this.logger.silly('filtering fit record');
            let params = { status };
            if (branch)
                params = Object.assign(Object.assign({}, params), { branch });
            return await this.fitModel.find(Object.assign({}, params));
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateFitStatus({ fitId, state }) {
        try {
            this.logger.silly('updating fit');
            const fitRecord = await this.fitModel.findById(fitId);
            if (!fitRecord) {
                this.logger.silly('fit not found');
                throw new utils_1.SystemError(200, 'fit not found');
            }
            fitRecord.status = state;
            return await fitRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
FitService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('fitModel')),
    __param(1, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object])
], FitService);
exports.FitService = FitService;
//# sourceMappingURL=index.js.map