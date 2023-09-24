import { IFit } from '../interfaces/IFit';
import mongoose from 'mongoose';

const Fit = new mongoose.Schema(
  {
    loanPurpose: {
        type: String
    },
    paybackTime: {
        type: String
    },
    howToPayback: {
        type: String
    },
    amount: {
        type: String
    },
    collateral: {
        type: String
    },
    surety: {
        type: String
    },
    contingencyPlan: {
        type: String
    },
    loanAlternative: {
        type: String
    },
    whySwiftlynx: {
        type: String
    },
    usefulToYou: {
        type: String
    },
    branch: {
        type: String
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DECLINED', 'COMPLETED', 'PENDING'],
        default: 'PENDING',
    },
    deleted: {
        type: Boolean,
        default: false
    },
  },

  { timestamps: true },
);

Fit.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IFit & mongoose.Document>('Fit', Fit);
