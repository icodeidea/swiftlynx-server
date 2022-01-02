import { IAppSetting } from '../interfaces';
import mongoose from 'mongoose';

const AppSetting = new mongoose.Schema({
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

export default mongoose.model<IAppSetting & mongoose.Document>('AppSetting', AppSetting);
