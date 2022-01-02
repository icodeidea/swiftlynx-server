import { IWallet } from '../interfaces';
import mongoose from 'mongoose';

const Wallet = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    active: {
      type: Boolean,
      default: false 
    },

    amount: { 
      type: Number,
      default: 0.0 
    },
  },
  { timestamps: true },
);

Wallet.set('toJSON', {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // delete returnedObject.;
  },
});

export default mongoose.model<IWallet & mongoose.Document>('Wallet', Wallet);
