import { IWallet } from '../interfaces';
import mongoose from 'mongoose';

const 
Safe = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    active: {
      type: Boolean,
      default: true
    },

    status: { 
      type: String,
      enum: ['pending', 'active', 'declined', 'completed'],
      default: 'active',
    },

    remark: { 
      type: String,
    },

    amountRaised: { 
      type: Number,
      default: 0.0 
    },

    goal: { 
      type: Number,
      default: 0.0 
    },
  },
  { timestamps: true },
);

Safe.set('toJSON', {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // delete returnedObject.;
  },
});

export default mongoose.model<IWallet & mongoose.Document>('safe', Safe);
