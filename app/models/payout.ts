import { IPayout } from '../interfaces';
import mongoose from 'mongoose';

const Payout = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'subjectRef',
    },
    subjectRef: {
      type: String,
      required: [true, 'Please provide an entity'],
      enum: ['safe', 'Trade'],
    },
    accountDetailId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountDetail',
    },
    metadata: { type: Object },
    status: { 
        type: String,
        enum: ['pending', 'completed', 'declined'],
        default: 'pending'
    },
    reason: { type: String },
  },
  { timestamps: true },
);

Payout.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IPayout & mongoose.Document>('Payout', Payout);