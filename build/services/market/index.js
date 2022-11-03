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
exports.MarketService = void 0;
const typedi_1 = require("typedi");
const utils_1 = require("../../utils");
let MarketService = class MarketService {
    constructor(marketModel, logger) {
        this.marketModel = marketModel;
        this.logger = logger;
    }
    async addMarket(market) {
        try {
            const marketExists = await this.marketModel.findOne({ marketName: market.marketName });
            if (marketExists)
                throw new utils_1.SystemError(200, 'market already existing');
            this.logger.silly('creating market');
            const createdMarket = await this.marketModel.create({
                marketName: market.marketName,
                sectorAvailable: market.sectorAvailable,
            });
            return createdMarket;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async getMarket(MarketId) {
        try {
            this.logger.silly('getting market record');
            if (!MarketId || MarketId === null)
                return await this.marketModel.find();
            const marketRecord = await this.marketModel
                .findOne({ $or: [
                    { 'id': MarketId },
                    { 'marketName': MarketId },
                ] });
            return marketRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async updateMarketStatistics(data) {
        try {
            this.logger.silly('updating market statistics');
            const { marketId, statistics } = data;
            const marketRecord = await this.marketModel
                .findOne({ 'id': marketId });
            for (const property in statistics) {
                marketRecord.kpi[property] = marketRecord.kpi[property] + statistics[property];
            }
            return await marketRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
MarketService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('marketModel')),
    __param(1, (0, typedi_1.Inject)('logger')),
    __metadata("design:paramtypes", [Object, Object])
], MarketService);
exports.MarketService = MarketService;
//# sourceMappingURL=index.js.map