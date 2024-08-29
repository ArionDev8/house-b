import mongoose from 'mongoose';
import { Listing } from '../models/Listing.js';
import { RealEstateErrors } from '../utils/ErrorHandler.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    res.status(200).send({ message: 'Listing saved successfully' });
  } catch {
    next(new RealEstateErrors());
  }
};

export const uploadImages = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { files } = req;

    // Find the listing by ID
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send({ message: 'Listing not found' });
    }

    // Add the uploaded image filenames to the listing's images array
    const uploadedImages = files.map((file) => ({ img: file.filename }));
    listing.images.push(...uploadedImages);

    // Save the updated listing
    await listing.save();

    res.status(200).send({ message: 'Images uploaded successfully', listing });
  } catch (error) {
    next(new RealEstateErrors());
  }
};


export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({});

    res.status(200).json(listings);
  } catch {
    next(new RealEstateErrors());
  }
};

export const updateListing = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(updatedListing);
  } catch {
    next(new RealEstateErrors());
  }
};

export const deleteListing = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid listing ID' });
  }

  try {
    const deletedListing = await Listing.findByIdAndDelete(
      new mongoose.Types.ObjectId(id),
    );

    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getAllNearListings = async (req, res, next) => {
  const { lat, long, maxDistance = 1000 } = req.query;

  if (!lat || !long) {
    return res
      .status(400)
      .json({ error: 'Latitude and longitude are required' });
  }

  try {
    const allNearListings = await Listing.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    res.status(200).json(allNearListings);
  } catch (error) {
    next(
      new RealEstateErrors(500, error.message, 'Failed to get nearby listings'),
    );
  }
};
