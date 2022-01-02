import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, 'Please enter a username'],
    },
    refId: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Please enter a username'],
      index: true,
    },
    referer: {
      type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
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
    kpi: {
      usersRefered: { type : Number, default: 0 },
      feedsEarned: { type: Number, default: 0 },
    },
    country: { type: String },
    picture: { type: String, default: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png?1592828498"},
    locale: { type: String }, // we track Ips this is where tracked Ips will be placed for good analytics
    lastLogin: {
      type: Date,
      default: new Date(),
    },
    deactivated: { type: Boolean, default: false },
  },

  { timestamps: true },
);

User.set('toJSON', {
  transform: (document, returnedObject) => {
    console.log()
    if(returnedObject.hasOwnProperty('toString')){
      returnedObject.id = returnedObject._id.toString();
      returnedObject.role = returnedObject.admin.toString();
    }else{
      returnedObject.id = returnedObject._id;
      returnedObject.role = returnedObject.admin;
    }
    
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
    delete returnedObject.admin;
    delete returnedObject.salt;
  },
});

export default mongoose.model<IUser & mongoose.Document>('User', User);
