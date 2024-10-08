import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const listingsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
  },

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
        // required: true,
      },
    },
  ],

  nrOfRooms: {
    type: Number,
    required: true,
  },

  nrOfBeds: {
    type: Number,
  },

  // elevator: {
  //   type: Boolean,
  //   required: true,
  // },

  buildingType: {
    type: String,
    enum: ['House', 'Hotel', 'Villa', 'Office'],
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

  // freeParking: {
  //   type: Boolean,
  //   required: true,
  // },

  // balcony: {
  //   type: Boolean,
  //   required: true,
  // },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

listingsSchema.index({ coordinates: '2dsphere' });

export const Listing = mongoose.model('Listings', listingsSchema);

const houseAmenities = [
  'Netflix',
  'Wi Fi',
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
  'Wi Fi',
  'Rooftop pool',
  'Private beach access',
  'In room dining',
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
  'Wi Fi',
  'Copier/printer/scanner',
  'Reception area',
  'Panoramic views',
  'Café or restaurant',
  'Rooftop terrace',
  'Secure parking',
];

export const newListingSchema = Joi.object({
  coordinates: Joi.array()
    .items(Joi.number().required()) // [longitude, latitude]
    .length(2)
    .required(),
  title: Joi.string().required(),
  address: Joi.string().required(),
  images: Joi.array()
    .items(
      Joi.object({
        img: Joi.string().uri().optional(),
      }),
    )
    .optional(),
  nrOfRooms: Joi.number().required(),
  nrOfBeds: Joi.number(),
  // elevator: Joi.boolean().required(),
  buildingType: Joi.string()
    .valid('House', 'Hotel', 'Villa', 'Office')
    .required(),
  amenities: Joi.array()
    .items(Joi.string().required())
    .required()
    .when('buildingType', {
      is: 'House',
      then: Joi.array()
        .items(Joi.string().valid(...houseAmenities))
        .required(),
    })
    .when('buildingType', {
      is: 'Hotel',
      then: Joi.array()
        .items(Joi.string().valid(...hotelAmenities))
        .required(),
    })
    .when('buildingType', {
      is: 'Villa',
      then: Joi.array()
        .items(Joi.string().valid(...villasAmenities))
        .required(),
    })
    .when('buildingType', {
      is: 'Office',
      then: Joi.array()
        .items(Joi.string().valid(...officeAmenities))
        .required(),
    }),
  price: Joi.number().required(),
  // freeParking: Joi.boolean().required(),
  // balcony: Joi.boolean().required(),
  // isFav: Joi.boolean().required(),
});

export const searchSchema = Joi.object({
  // coordinates: Joi.array().items(Joi.number().required()).length(2).required(),
  // title: Joi.string().min(4),
  city: Joi.string().required(),
  startDate: Joi.date().timestamp().required(),
  endDate: Joi.date().timestamp().required(),
  maxPrice: Joi.number(),
  minPrice: Joi.number(),
  nrOfRooms: Joi.number(),
  nrOfBeds: Joi.number(),
  buildingType: Joi.string(),
  amenities: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string(),
  ),
}).required();

export const updateListingSchema = Joi.object({
  title: Joi.string(),
  address: Joi.string(),
  nrOfRooms: Joi.number(),
  nrOfBeds: Joi.number(),
  buildingType: Joi.string().valid('House', 'Hotel', 'Villa', 'Office'),
  amenities: Joi.array()
    .items(Joi.string().required())
    .when('buildingType', {
      is: 'House',
      then: Joi.array().items(Joi.string().valid(...houseAmenities)),
    })
    .when('buildingType', {
      is: 'Hotel',
      then: Joi.array().items(Joi.string().valid(...hotelAmenities)),
    })
    .when('buildingType', {
      is: 'Villa',
      then: Joi.array().items(Joi.string().valid(...villasAmenities)),
    })
    .when('buildingType', {
      is: 'Office',
      then: Joi.array().items(Joi.string().valid(...officeAmenities)),
    }),
  price: Joi.number(),
}).required();
