"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AppSetting = new mongoose_1.default.Schema({
    referalReward: {
        type: Number,
        default: 2.5,
    },
    dailySignInReward: {
        type: Number,
        default: 2.5,
    },
    signupInReward: {
        type: Number,
        default: 0.11,
    },
});
AppSetting.set('toJSON', {
    transform: (document, returnedObject) => {
        // returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('AppSetting', AppSetting);
//# sourceMappingURL=appSettings.js.map