import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const usersSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favouriteListings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Listings',
    },
  ],
});

export const User = mongoose.model('User', usersSchema);

export const newUserSchema = Joi.object({
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(255).required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  email: Joi.string().email(),
  password: Joi.string(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(255).required(),
});
