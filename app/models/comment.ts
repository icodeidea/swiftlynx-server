import { IComment } from '../interfaces/IComment';
import mongoose from 'mongoose';

const Comment = new mongoose.Schema(
  {
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'subjectRef',
    },

    slug: {
      type: String
    },

    subjectRef: {
        type: String,
        enum: ['Feed', 'Comment'],
        default: 'Feed',
    },

    kpi: {
        comments: { type : Number, default: 0 },
        reaction: { type: Number, default: 0 },
    },

    content: {
      type: String
    },

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

Comment.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IComment & mongoose.Document>('Comment', Comment);
