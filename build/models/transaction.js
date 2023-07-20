"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Transaction = new mongoose_1.default.Schema({
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
        enum: ['Safe', 'Contract', 'User'],
        default: 'Contract',
    },
    type: { type: String, required: true },
    metadata: { type: Object },
    confirmed: { type: Boolean },
    confirmations: { type: Number },
    pending: { type: Boolean },
    txid: { type: String },
    status: { type: String },
    reason: { type: String },
    from: { type: String },
    fee: { type: String },
    to: {
        recipient: { type: String, default: 'self' },
        amount: { type: String },
    },
}, { timestamps: true });
Transaction.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Transaction', Transaction);
//# sourceMappingURL=transaction.js.map