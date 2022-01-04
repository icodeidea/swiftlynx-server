import { ITrade } from '../interfaces/ITrade';
import mongoose from 'mongoose';

const Trade = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
    },
    type: {
        type: String,
        enum: ['SWIFT_TRADE', 'PEER_TO_PEER_TRADE'],
        default: 'SWIFT_TRADE',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DECLINED'],
        default: 'PENDING',
    },
    amount: {
        type: Number,
        required: true,
    },
    interest: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    slug: {
      type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
  },

  { timestamps: true },
);

Trade.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<ITrade & mongoose.Document>('Trade', Trade);
