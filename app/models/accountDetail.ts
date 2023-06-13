import { IAccountDetail } from '../interfaces';
import mongoose from 'mongoose';

const AccountDetail = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    accountName: {
      type: String,
      required: [true, 'Please provide an account name'],
    },
    accountNumber: {
        type: String,
        required: [true, 'Please provide an account number'],
    },
    bankname: {
        type: String,
        required: [true, 'Please provide bank name'],
    },
  },
  { timestamps: true },
);

AccountDetail.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IAccountDetail & mongoose.Document>('AccountDetail', AccountDetail);