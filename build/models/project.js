"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const Project = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    marketId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Market',
        required: true,
    },
    projectName: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    projectBanner: {
        type: String,
        default: 'http://iconerecife.com.br/wp-content/plugins/uix-page-builder/includes/uixpbform/images/default-cover-6.jpg',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    projectType: {
        type: String,
        enum: ['STARTUP', 'OFFICIAL'],
        default: 'OFFICIAL',
    },
    totalFund: {
        type: Number,
        default: 0,
    },
    kpi: {
        totalTrade: { type: Number, default: 0 },
        totalContract: { type: Number, default: 0 },
        tradeSteak: { type: Number, default: 0 },
        contractSteak: { type: Number, default: 0 },
        contractCount: { type: Number, default: 0 }
    },
    slug: {
        type: String,
        default: function () {
            (0, slugify_1.default)(this.projectName);
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
Project.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Project', Project);
//# sourceMappingURL=project.js.map