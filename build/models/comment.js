"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Comment = new mongoose_1.default.Schema({
    User: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        refPath: 'subjectRef',
    },
    slug: {
        type: String
    },
    subjectRef: {
        type: String,
        enum: ['Feed', 'Comment'],
        default: 'Feed',
    },
    kpi: {
        comments: { type: Number, default: 0 },
        reaction: { type: Number, default: 0 },
    },
    content: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
    comment: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Comment',
        }],
    reaction: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        }],
}, { timestamps: true });
Comment.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Comment', Comment);
//# sourceMappingURL=comment.js.map