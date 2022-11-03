"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Feed = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Please enter a slug'],
        index: true,
    },
    kpi: {
        comments: { type: Number, default: 0 },
        reaction: { type: Number, default: 0 },
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    shortContent: {
        type: String
    },
    image: {
        type: String,
        allowNull: false,
    },
    published: {
        type: Boolean,
        default: true
    },
    reward: {
        type: Number,
        default: 10,
    },
    threshold: {
        type: Number,
        default: 1000,
    },
    tags: [{
            type: String
        }],
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
Feed.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = mongoose_1.default.model('Feed', Feed);
//# sourceMappingURL=feed.js.map