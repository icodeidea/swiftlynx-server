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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const typedi_1 = require("typedi");
const eventDispatcher_1 = require("../../../../decorators/eventDispatcher");
const utils_1 = require("../../../../utils");
const config_1 = __importDefault(require("../../../../config"));
let EtheriumService = class EtheriumService {
    constructor(logger, eventDispatcher) {
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
    }
    async GetEndpointsWithPrefix({ data }) {
        try {
            this.logger.silly(`Fetching Eth node ...`);
            const url = await (0, utils_1.prefixQueryParams)(config_1.default.bscScanUrl, data);
            const result = await axios_1.default.get(`${url}`);
            return result;
        }
        catch (e) {
            this.logger.error(e);
            console.log('driver error ', e);
            throw e;
        }
    }
};
EtheriumService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('logger')),
    __param(1, (0, eventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [Object, eventDispatcher_1.EventDispatcherInterface])
], EtheriumService);
exports.default = EtheriumService;
//# sourceMappingURL=curl.js.map