import Joi from 'joi';
import mongoose from 'mongoose';

export const ObjectIdParam = Joi.object({
  id: Joi.custom((value) => {
    if (mongoose.Types.ObjectId.isValid(value)) {
      return new mongoose.Types.ObjectId(value);
    } else {
      throw new Error('NOPE');
    }
  }),
});
