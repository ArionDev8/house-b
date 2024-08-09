import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const reviewsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },

  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listings',
    required: true,
  },

  stars: {
    type: Number,
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },
});

export const Review = mongoose.model('Reviews', reviewsSchema);

export const newReviewSchema = Joi.object({
  userId: Joi.string().required(),
  listingId: Joi.string().required(),
  stars: Joi.number().required(),
  comment: Joi.string().min(20).max(100).required(),
});

export const updateReviewSchema = Joi.object({
  stars: Joi.number().required(),
  comment: Joi.string().min(20).max(100).required(),
});
