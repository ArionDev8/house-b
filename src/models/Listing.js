import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const listingsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  coordinates: [
    {
      lat: {
        type: Number,
        required: true,
      },
      long: {
        type: Number,
        required: true,
      },
    },
  ],

  title: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  images: [
    {
      img: {
        type: String,
        required: true,
      },
    },
  ],

  nrOfRooms: {
    type: Number,
    required: true,
  },

  nrOfToilets: {
    type: Number,
    required: true,
  },

  floorNumber: {
    type: Number,
    required: true,
  },

  elevator: {
    type: Boolean,
    required: true,
  },

  buildingType: {
    type: String,
    enum: ['rezidenciale', 'komerciale'],
    required: true,
  },

  typology: {
    type: String,
    enum: [
      'Apartament',
      'Vile',
      'Private House',
      'Garage',
      'Truall',
      'Zyre',
      'Dyqan',
      'Toke',
      'Shitje biznesi',
    ],
    required: true,
  },

  yearFinished: {
    type: Number,
    required: true,
  },

  sharedArea: {
    type: Number,
    required: true,
  },

  netArea: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  furnished: {
    type: Boolean,
    required: true,
  },

  parkingSlots: {
    type: Number,
    required: true,
  },

  balcony: {
    type: Boolean,
    required: true,
  },

  type: {
    type: String,
    enum: ['Shitje', 'qera'],
    required: true,
  },
});

export const Listing = mongoose.model('Listings', listingsSchema);

export const newListingSchema = Joi.object({
  userId: Joi.string().required(),
  coordinates: Joi.array()
    .items(
      Joi.object({
        lat: Joi.number().required(),
        long: Joi.number().required(),
      }),
    )
    .required(),

  title: Joi.string().required(),
  address: Joi.string().required(),

  images: Joi.array()
    .items(
      Joi.object({
        img: Joi.string().uri().required(),
      }),
    )
    .required(),

  nrOfRooms: Joi.number().required(),
  nrOfToilets: Joi.number().required(),
  floorNumber: Joi.number().required(),
  elevator: Joi.boolean().required(),
  buildingType: Joi.string().valid('rezidenciale', 'komerciale').required(),
  typology: Joi.string()
    .valid(
      'Apartament',
      'Vile',
      'Private House',
      'Garage',
      'Truall',
      'Zyre',
      'Dyqan',
      'Toke',
      'Shitje biznesi',
    )
    .required(),
  yearFinished: Joi.number().required(),
  sharedArea: Joi.number().required(),
  netArea: Joi.number().required(),
  price: Joi.number().required(),
  furnished: Joi.boolean().required(),
  parkingSlots: Joi.number().required(),
  balcony: Joi.boolean().required(),
  type: Joi.string().valid('Shitje', 'qera').required(),
});
