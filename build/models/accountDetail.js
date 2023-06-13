"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountDetail = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    accountName: {
        type: String,
        required: [true, 'Please provide an account name'],
    },
    accountNumber: {
        type: String,
        required: [true, 'Please provide an account number'],
    },
    bankname: {
        type: String,
        required: [true, 'Please provide bank name'],
    },
}, { timestamps: true });
AccountDetail.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('AccountDetail', AccountDetail);
//# sourceMappingURL=accountDetail.js.map