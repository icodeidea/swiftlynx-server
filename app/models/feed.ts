import { IFeed } from '../interfaces/IFeed';
import mongoose from 'mongoose';
import { number } from 'joi';

const Feed = new mongoose.Schema(
  {
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Please enter a slug'],
      index: true,
    },

    kpi: {
        comments: { type : Number, default: 0 },
        reaction: { type: Number, default: 0 },
    },

    title: {
        type: String
    },

    content: {
      type: String
    },

    shortContent: {
      type: String
    },

    image: {
        type: String,
        allowNull: false,
    },
      
    published: {
        type: Boolean,
        default: true
    },

    reward: {
      type: Number,
      default: 10,
    },

    threshold: {
      type: Number,
      default: 1000,
    },

    tags: [{
      type: String
    }],

    deleted: {
        type: Boolean,
        default: false
    },

    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],

    reaction: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
  },

  { timestamps: true },
);

Feed.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IFeed & mongoose.Document>('Feed', Feed);
