import { IMarket } from '../interfaces/IMarket';
import mongoose from 'mongoose';
import slugify from 'slugify';

const Market = new mongoose.Schema(
  {
    marketName: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DECLINED'],
        default: 'ACTIVE',
    },
    sectorAvailable: {
        type: String,
        enum: ['INVESTMENT', 'LOAN'],
        default: 'ALL',
    },
    kpi: {
      totalTrade: { type : Number, default: 0 },
      totalContract: { type: Number, default: 0 },
      tradeSteak: { type : Number, default: 0 },
      contractSteak: { type: Number, default: 0 },
      projectCount: { type: Number, default: 0 }
    },
    slug: {
      type: String,
      default: function() {
        slugify(this.marketName);
      }
    },
    deleted: {
        type: Boolean,
        default: false
    },
  },

  { timestamps: true },
);

Market.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IMarket & mongoose.Document>('Market', Market);
