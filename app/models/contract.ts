import { IContract } from '../interfaces/IContract';
import mongoose from 'mongoose';
import slugify from 'slugify';

const Contract = new mongoose.Schema(
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
    contractName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        enum: ['SWIFT_LOAN', 'PEER_TO_PEER_LOAN'],
        default: 'SWIFT_LAOAN',
    },
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED'],
        default: 'CLOSED',
    },
    fixedAmount: {
        type: Number,
        default: 0
    },
    minAmount: {
        type: Number,
        default: 0
    },
    maxAmount: {
        type: Number,
        default: 0
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
    },
    maturityTime: {
        type: String,
    },
    kpi: {
        signedCount: { type : Number, default: 0 },
    },
    slug: {
      type: String,
      default:  function() {
        slugify(this.contractName);
      }
    },
    deleted: {
        type: Boolean,
        default: false
    },
  },

  { timestamps: true },
);

Contract.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IContract & mongoose.Document>('Contract', Contract);
