import { IProject } from '../interfaces/IProject';
import mongoose from 'mongoose';
import slugify from 'slugify';

const Project = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    marketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Market',
        required: true,
    },
    projectName: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    projectBanner: {
        type: String,
        default: 'path to default image',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE',
    },
    projectType: {
        type: String,
        enum: ['STARTUP', 'OFFICIAL'],
        default: 'OFFICIAL',
    },
    totalFund: {
        type: Number,
        default: 0,
    },
    kpi: {
        totalTrade: { type : Number, default: 0 },
        totalContract: { type: Number, default: 0 },
        tradeSteak: { type : Number, default: 0 },
        contractSteak: { type: Number, default: 0 },
        contractCount: { type: Number, default: 0 }
    },
    slug: {
      type: String,
      default: function() {
        slugify(this.projectName);
      }
    },
    deleted: {
        type: Boolean,
        default: false
    },
  },

  { timestamps: true },
);

Project.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IProject & mongoose.Document>('Project', Project);
