"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Wallet = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    active: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        default: 0.0
    },
}, { timestamps: true });
Wallet.set('toJSON', {
    transform: (document, returnedObject) => {
        // returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // delete returnedObject.;
    },
});
exports.default = mongoose_1.default.model('Wallet', Wallet);
//# sourceMappingURL=wallet.js.map