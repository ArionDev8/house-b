import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const reservationsSchema = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listings',
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Reservation = mongoose.model('reservations', reservationsSchema);

export const newReservationSchema = Joi.object({
  startDate: Joi.date().timestamp('unix').required(),
  endDate: Joi.date().timestamp('unix').required(),
});

export const updateReservationSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});
