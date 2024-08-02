import mongoose from 'mongoose';
import Joi from 'joi';
const { Schema } = mongoose;

const rezidencialeOptions = [
  'Apartament',
  'Vile',
  'Private House',
  'Garage',
  'Penthouse',
  'Duplex',
  'Truall',
];
const komercialeOptions = ['Zyre', 'Dyqan', 'Toke', 'Shitje biznesi'];

const listingsSchema = new Schema({
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
    type: {
      type: String,
      enum: ['rezidenciale', 'komerciale'],
      required: true,
    },
    subtype: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (this.buildingType.type === 'rezidenciale') {
            return rezidencialeOptions.includes(v);
          } else if (this.buildingType.type === 'komerciale') {
            return komercialeOptions.includes(v);
          }
          return false;
        },
        message: (props) =>
          `${props.value} is not a valid subtype for the given building type`,
      },
    },
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

export const Listings = mongoose.model('Listings', listingsSchema);

const validateListing = (listing) => {
  const schema = Joi.object({
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

    buildingType: Joi.object({
      type: Joi.string().valid('rezidenciale', 'komerciale').required(),
      subtype: Joi.string()
        .required()
        .custom((value, helpers) => {
          const { type } = helpers.state.ancestors[0].buildingType;
          if (type === 'rezidenciale' && !rezidencialeOptions.includes(value)) {
            return helpers.message(
              `${value} is not a valid subtype for rezidenciale`,
            );
          } else if (
            type === 'komerciale' &&
            !komercialeOptions.includes(value)
          ) {
            return helpers.message(
              `${value} is not a valid subtype for komerciale`,
            );
          }
          return value;
        }),
    }).required(),

    yearFinished: Joi.number().required(),
    sharedArea: Joi.number().required(),
    netArea: Joi.number().required(),
    price: Joi.number().required(),
    furnished: Joi.boolean().required(),
    parkingSlots: Joi.number().required(),
    balcony: Joi.boolean().required(),
    type: Joi.string().valid('Shitje', 'qera').required(),
  });

  return schema.validate(listing);
};

export default validateListing;
