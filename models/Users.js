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
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
    default: 'user',
  },
});

export const Users = mongoose.model('Users', usersSchema);

const usersJoiSchema = Joi.object({
  firstName: Joi.string().min(4).max(50).required(),
  lastName: Joi.string().min(4).max(50).required(),
  email: Joi.string()
    .email({ tlds: { allow: ['com', 'org'] } })
    .required(),
  password: Joi.string().min(6).max(255).required(),
  role: Joi.string().valid('user', 'admin').required(),
});

export const validateUser = (user) => {
  return usersJoiSchema.validate(user);
};
