"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Trade = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    projectId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
    },
    contractId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Contract',
    },
    type: {
        type: String,
        enum: ['SWIFT_TRADE', 'PEER_TO_PEER_LOAN'],
        default: 'SWIFT_TRADE',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DECLINED', 'COMPLETED', 'PENDING'],
        default: 'PENDING',
    },
    amount: {
        type: Number,
        required: true,
    },
    interest: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        default: '6',
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    slug: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
Trade.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Trade', Trade);
//# sourceMappingURL=trade.js.map