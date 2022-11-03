"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const APIKey = new mongoose_1.default.Schema({
    //TODO make a better model for this to aviod repetition of USER_ID
    apis: [
        {
            key: { type: String, unique: true },
            name: { type: String, unique: true },
            expires: { type: Date },
            active: { type: Boolean, default: true },
            account: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
        },
    ],
    plan: {
        type: String,
        enum: ['BASIC', 'PRO', 'ENTERPRISE', 'PROMO'],
        default: 'BASIC',
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
});
APIKey.set('toJSON', {
    transform: (document, returnedObject) => {
        // returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('APIKey', APIKey);
//# sourceMappingURL=apiKey.js.map