"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Activity = new mongoose_1.default.Schema({
    User: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    subject: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: 'subjectRef',
    },
    subjectRef: {
        type: String,
        enum: ['Feed', 'Comment'],
        default: 'Feed',
    },
    content: {
        type: String
    },
    type: {
        type: String,
        enum: ['earn', 'withdraw'],
        default: 'earn',
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
Activity.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Activity', Activity);
//# sourceMappingURL=activity.js.map