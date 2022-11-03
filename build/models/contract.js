"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const Contract = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
    },
    contractName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['SWIFT_LOAN', 'PEER_TO_PEER_LOAN'],
        default: 'SWIFT_LAOAN',
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED'],
        default: 'CLOSED',
    },
    fixedAmount: {
        type: Number,
    },
    minAmount: {
        type: Number,
    },
    maxAmount: {
        type: Number,
    },
    interest: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    endDate: {
        type: Date,
    },
    maturityTime: {
        type: String,
    },
    kpi: {
        signedCount: { type: Number, default: 0 },
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
Contract.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Contract', Contract);
//# sourceMappingURL=contract.js.map