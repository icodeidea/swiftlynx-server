"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const Market = new mongoose_1.default.Schema({
    marketName: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DECLINED'],
        default: 'ACTIVE',
    },
    description: {
        type: String,
    },
    sectorAvailable: {
        type: String,
        enum: ['INVESTMENT', 'LOAN', 'ALL'],
        default: 'ALL',
    },
    kpi: {
        totalTrade: { type: Number, default: 0 },
        totalContract: { type: Number, default: 0 },
        tradeSteak: { type: Number, default: 0 },
        contractSteak: { type: Number, default: 0 },
        projectCount: { type: Number, default: 0 }
    },
    slug: {
        type: String,
        default: function () {
            (0, slugify_1.default)(this.marketName);
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
Market.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Market', Market);
//# sourceMappingURL=market.js.map