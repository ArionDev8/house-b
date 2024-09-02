import mongoose from 'mongoose';
import { Listing } from '../models/Listing.js';
import { Availability } from '../models/Availability.js';
import { RealEstateErrors } from '../utils/ErrorHandler.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = new Listing({
      ...req.body,
      userId: req.user.id,
    });
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

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send({ message: 'Listing not found' });
    }

    const uploadedImages = files.map((file) => ({ img: file.filename }));
    listing.images.push(...uploadedImages);

    await listing.save();

    res.status(200).send({ message: 'Images uploaded successfully', listing });
  } catch {
    next(new RealEstateErrors());
  }
};

export const searchListings = async (req, res, next) => {
  try {
    const { title, startDate, endDate } = req.query;
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
    const availability = await Availability.aggregate([
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            startDate: {
              $lte: startDate,
            },
            endDate: {
              $gte: endDate,
            },
          },
      },
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: 'listings',
            localField: 'listingId',
            foreignField: '_id',
            as: 'result',
          },
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: '$result',
            preserveNullAndEmptyArrays: false,
          },
      },
      {
        $match: {
          'result.isDeleted': false,
        },
      },
    ]);

    res
      .status(200)
      .json(
        availability
          .map((r) => r.result)
          .filter((r) => (title ? r.title.includes(title) : true)),
      );
  } catch (err) {
    console.log(err);

    next(new RealEstateErrors());
  }
};

export const getAllYourListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userId: req.user.id });
    const filteredListings = listings.filter(
      (listing) => listing.isDeleted === false,
    );

    if (!filteredListings) {
      return res.status(404).send({ message: 'You have no listings.' });
    }

    return res.status(200).json(filteredListings);
  } catch {
    next(new RealEstateErrors());
  }
};

export const getOneListing = async (req, res, next) => {
  try {
    const { id: listingId } = req.params;
    const listing = await Listing.findOne({
      userId: req.user.id,
      _id: listingId,
    });

    if (!listing) {
      return res.status(404).send({ message: 'Listing not found' });
    }

    return res.status(200).json(listing);
  } catch {
    next(new RealEstateErrors());
  }
};

export const updateListing = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedListing = await Listing.findOneAndUpdate(
      { userId: req.user.id, _id: id },
      req.body,
      {
        new: true,
      },
    );

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
    const deletedListing = await Listing.findById(id);

    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (deletedListing.isDeleted === true) {
      return res.status(400).send({ message: 'Listing already deleted' });
    } else {
      deletedListing.isDeleted = true;

      await deletedListing.save();
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

    const filteredAllNearListings = allNearListings.filter(
      (listing) => listing.isDeleted === false,
    );
    res.status(200).json(filteredAllNearListings);
  } catch (error) {
    next(
      new RealEstateErrors(500, error.message, 'Failed to get nearby listings'),
    );
  }
};

export const pagination = async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    let movies = Listing.find().skip(skip).limit(limit);
    movies = await movies;

    res.json(movies);
  } catch (error) {
    next(new RealEstateErrors(error.message));
  }
};
