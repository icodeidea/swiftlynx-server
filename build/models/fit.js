"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Fit = new mongoose_1.default.Schema({
    loanPurpose: {
        type: String
    },
    paybackTime: {
        type: String
    },
    howToPayback: {
        type: String
    },
    amount: {
        type: String
    },
    collateral: {
        type: String
    },
    surety: {
        type: String
    },
    contingencyPlan: {
        type: String
    },
    loanAlternative: {
        type: String
    },
    whySwiftlynx: {
        type: String
    },
    usefulToYou: {
        type: String
    },
    branch: {
        type: String
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DECLINED', 'COMPLETED', 'PENDING'],
        default: 'PENDING',
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
Fit.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Fit', Fit);
//# sourceMappingURL=fit.js.map