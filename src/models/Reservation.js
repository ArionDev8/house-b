import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const reservationsSchema = new Schema({
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

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Reservation = mongoose.model('reservations', reservationsSchema);

export const newReservationSchema = Joi.object({
  listingId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

export const updateReservationSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});
