import { ITransaction } from '../interfaces';
import mongoose from 'mongoose';

const Transaction = new mongoose.Schema(
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
      enum: ['Safe', 'Contract', 'User', 'Trade'],
      default: 'Contract',
    },
    type: { type: String, required: true },
    metadata: { type: Object },
    confirmed: { type: Boolean },
    confirmations: { type: Number },
    pending: { type: Boolean },
    txid: { type: String },
    status: { type: String },
    reason: { type: String },
    from: { type: String },
    fee: { type: String },
    to:{
        recipient: { type: String, default: 'self' },
        amount: { type: Number, default: 0.0  },
      },
  },
  { timestamps: true },
);

Transaction.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<ITransaction & mongoose.Document>('Transaction', Transaction);