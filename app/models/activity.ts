import { IActivity } from '../interfaces/IActivity';
import mongoose from 'mongoose';

const Activity = new mongoose.Schema(
  {
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'subjectRef',
    },

    subjectRef: {
        type: String,
        enum: ['Feed', 'Comment'],
        default: 'Feed',
    },

    content: {
      type: String
    },

    type: {
        type: String,
        enum: ['earn', 'withdraw'],
        default: 'earn',
    },

    deleted: {
        type: Boolean,
        default: false
    },
  },

  { timestamps: true },
);

Activity.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model<IActivity & mongoose.Document>('Activity', Activity);
