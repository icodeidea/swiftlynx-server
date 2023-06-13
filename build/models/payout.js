"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Payout = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    subject: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: 'subjectRef',
    },
    subjectRef: {
        type: String,
        required: [true, 'Please provide an entity'],
        enum: ['safe', 'Trade'],
    },
    accountDetailId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'AccountDetail',
    },
    metadata: { type: Object },
    status: {
        type: String,
        enum: ['pending', 'completed', 'declined'],
        default: 'pending'
    },
    reason: { type: String },
}, { timestamps: true });
Payout.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Payout', Payout);
//# sourceMappingURL=payout.js.map