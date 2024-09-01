import mongoose from 'mongoose';
import { Availability } from '../models/Availability';
import { Listing } from '../models/Listing';
import { RealEstateErrors } from '../utils/ErrorHandler';

export const createAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = Listing.findById(id);

    if ((req.user.id === listing.userId)) {
      const availability = new Availability(req.body);
      await availability.save();

      return res.status(201).json(availability);
    } else {
      res.status(402).send({ message: 'Not your property' });
    }
  } catch {
    next(new RealEstateErrors());
  }
};
