import { IAPIKey } from '../interfaces/IAPIKey';
import mongoose from 'mongoose';

const APIKey = new mongoose.Schema({
  //TODO make a better model for this to aviod repetition of USER_ID
  apis: [
    {
      key: { type: String, unique: true },
      name: { type: String, unique: true }, //incase a user wants to name there API key with something
      expires: { type: Date },
      active: { type: Boolean, default: true },
      account: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  plan: {
    type: String,
    enum: ['BASIC', 'PRO', 'ENTERPRISE', 'PROMO'],
    default: 'BASIC',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model<IAPIKey & mongoose.Document>('APIKey', APIKey);
