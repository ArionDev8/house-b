//import mongoose from 'mongoose';
import { Availability } from '../models/Availability.js';
import { Listing } from '../models/Listing.js';
import { RealEstateErrors } from '../utils/ErrorHandler.js';

export const createAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (req.user.id === listing.userId.toString()) {
      const availability = new Availability(req.body);
      await availability.save();

      return res.status(201).send({
        message: `Availability for listing with title ${listing.title} set successfully.`,
      });
    } else {
      res.status(402).send({ message: 'Something went wrong.' });
    }
  } catch (error) {
    console.log(error);

    next(new RealEstateErrors());
  }
};

export const getAvailabilityForAListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).send({ message: 'Listing not found' });
    }

    const availabilities = await Availability.find({ listingId: listing._id });

    return res.status(200).json(availabilities);
  } catch (error) {
    console.error('Error:', error);
    next(new RealEstateErrors(error.message));
  }
};
