import Joi from 'joi';

export const createCommentSchema = Joi.object({
    subject: Joi.string().required(),
    subjectRef: Joi.string().valid("Feed", "Comment").required(),
    content: Joi.string().required(),
});