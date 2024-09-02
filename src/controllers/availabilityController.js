//import mongoose from 'mongoose';
import { Availability } from '../models/Availability.js';
import { Listing } from '../models/Listing.js';
import { RealEstateErrors } from '../utils/ErrorHandler.js';

export const createAvailability = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
    if (startDate.getTime() >= endDate.getTime()) {
      return res.status(400).send({ message: 'Bad Request' });
    }
    const { id } = req.params;

    const listing = await Listing.findById(id).lean();

    if (req.user.id !== listing.userId.toString()) {
      return res.status(404).send({ message: 'Not Found.' });
    }

    const conflictingAvailability = await Availability.find({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    }).lean();

    if (conflictingAvailability) {
      return res.status(400).send({ message: 'Conflicting availability' });
    }

    const availability = new Availability({
      startDate,
      endDate,
      listingId: id,
    });
    await availability.save();

    return res.status(201).send({
      message: `Availability for listing with title ${listing.title} set successfully.`,
    });
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
