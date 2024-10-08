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

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Review = mongoose.model('Reviews', reviewsSchema);

export const newReviewSchema = Joi.object({
  stars: Joi.number().required(),
  comment: Joi.string().min(10).max(100).required(),
});

export const updateReviewSchema = Joi.object({
  stars: Joi.number().required(),
  comment: Joi.string().min(20).max(100).required(),
});
