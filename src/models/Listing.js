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

  elevator: {
    type: Boolean,
    required: true,
  },

  buildingType: {
    type: String,
    enum: ['Apartament', 'Villa', 'Hotel', 'Office'],
    required: true,
  },

  amenities: [
    {
      type: String,
      required: true,
    },
  ],

  price: {
    type: Number,
    required: true,
  },

  freeParking: {
    type: Boolean,
    required: true,
  },

  balcony: {
    type: Boolean,
    required: true,
  },
});

export const Listing = mongoose.model('Listings', listingsSchema);

const houseAmenities = [
  'Netflix',
  'Wi-Fi',
  'Free Parking',
  'Pool',
  'Air Conditioning',
  'Laundry',
  'Balcony',
];

const hotelAmenities = [
  'Swimming pool',
  'Fitness center',
  'Spa treatments',
  'Restaurant and bar',
  'Room service',
  'Laundry service',
  'Wi-Fi',
  'Rooftop pool',
  'Private beach access',
  'In-room dining',
  'Number of Beds',
  'Number of Rooms',
];

const villasAmenities = [
  'Private pool',
  'Kitchen',
  'Laundry facilities',
  'Garden',
  'Barbecue grill',
  'Parking',
  'Home theater',
  'Game room',
  'Wine cellar',
  'Personal chef',
  'Guest house',
  'Number of Bathrooms',
  'Number of Rooms',
  'Panoramic View',
];

const officeAmenities = [
  'Meeting rooms',
  'Conference rooms',
  'Shared workspace',
  'Kitchenette',
  'Wi-Fi',
  'Copier/printer/scanner',
  'Reception area',
  'Panoramic views',
  'Café or restaurant',
  'Rooftop terrace',
  'Secure parking',
  'Number of Bathrooms',
];

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
  elevator: Joi.boolean().required(),
  buildingType: Joi.string()
    .valid('Apartament', 'Villa', 'Hotel', 'Office')
    .required(),
  amenities: Joi.array()
    .items(Joi.string().required())
    .when('buildingType', {
      is: 'Apartment',
      then: Joi.array()
        .items(Joi.string().valid(...houseAmenities))
        .required(),
      otherwise: Joi.when('buildingType', {
        is: 'Hotel',
        then: Joi.array()
          .items(Joi.string().valid(...hotelAmenities))
          .required(),
        otherwise: Joi.when('buildingType', {
          is: 'Villa',
          then: Joi.array()
            .items(Joi.string().valid(...villasAmenities))
            .required(),
          otherwise: Joi.array()
            .items(Joi.string().valid(...officeAmenities))
            .required(),
        }),
      }),
    }),
  price: Joi.number().required(),
  freeParking: Joi.boolean().required(),
  balcony: Joi.boolean().required(),
});
