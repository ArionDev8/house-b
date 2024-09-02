import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const availabilities = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listings',
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },
});

export const Availability = mongoose.model('availability', availabilities);

export const newAvailabilitySchema = Joi.object({
  startDate: Joi.date().timestamp('unix').required(),
  endDate: Joi.date().timestamp('unix').required(),
});
