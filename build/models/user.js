"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User = new mongoose_1.default.Schema({
    firstname: {
        type: String,
        // required: [true, 'Please provide your firstname'],
    },
    lastname: {
        type: String,
        // required: [true, 'Please provide your lastname'],
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Please enter a username'],
    },
    refId: {
        type: String,
        lowercase: true,
        // unique: true,
        // required: [true, 'Please enter a username'],
        index: true,
    },
    referer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    tokenVersion: { type: Number, default: 0 },
    verified: {
        token: { value: { type: String },
            expires: { type: Date, default: Date.now() + 24 * 60 * 60 * 1000 } },
        isVerified: { type: Boolean, default: false },
    },
    reset: {
        token: { type: String },
        expires: { type: Date },
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Please provide an email'],
        index: true,
    },
    wallet: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Wallet',
    },
    oneTimeSetup: { type: Boolean, default: false },
    passwordSet: { type: Boolean, default: true },
    password: { type: String },
    salt: { type: String },
    role: {
        type: String,
        enum: ['NONE', 'JUNIOR', 'SENIOR', 'STAFF', 'MANAGER', 'DEVOPS', 'SUDO'],
        default: 'NONE',
    },
    accountType: {
        type: String,
        enum: ['individual', 'organisation'],
        default: 'individual',
    },
    kpi: {
        usersRefered: { type: Number, default: 0 },
    },
    metadata: {},
    country: { type: String },
    dob: { type: String },
    gender: {
        type: String,
        enum: ['male', 'female', 'undecided'],
        default: 'undecided',
    },
    picture: { type: String, default: "https://res.cloudinary.com/diituo7sj/image/upload/v1734017844/default-profile-picture1-705x705_bazo4q.jpg" },
    locale: { type: String },
    lastLogin: {
        type: Date,
        default: new Date(),
    },
    deactivated: { type: Boolean, default: false },
}, { timestamps: true });
User.set('toJSON', {
    transform: (document, returnedObject) => {
        if (returnedObject.hasOwnProperty('toString')) {
            returnedObject.id = returnedObject._id.toString();
            // returnedObject.role = returnedObject.admin.toString();
        }
        else {
            returnedObject.id = returnedObject._id;
            // returnedObject.role = returnedObject.admin;
        }
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password;
        // delete returnedObject.admin;
        delete returnedObject.salt;
    },
});
exports.default = mongoose_1.default.model('User', User);
//# sourceMappingURL=user.js.map