import mongoose from 'mongoose';
import { Listing } from '../models/Listing.js';
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
    const { city, startDate, endDate, buildingType, amenities } = req.query;
    const coordinates = [];
    var requestOptions = {
      method: 'GET',
    };

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&lang=en&type=city&format=json&apiKey=12bcdbae70604c2fa5b82073ff4fcbed`,
      requestOptions,
    );

    if (!response.ok) {
      return next(new RealEstateErrors(400, 'Failed to fetch location data'));
    }

    const data = await response.json();

    const lat = data.results[0].lat;
    const lon = data.results[0].lon;

    coordinates.push(lat, lon);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    if (startDate.getTime() <= new Date().setUTCHours(0, 0, 0, 0)) {
      next(new RealEstateErrors(400, 'Date cannot be in the past'));
      return;
    }

    if (endDate < startDate) {
      next(
        new RealEstateErrors(400, 'End date cannot be less than start date'),
      );
      return;
    }

    const listingsAvailable = await Listing.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [
              parseFloat(coordinates[0]),
              parseFloat(coordinates[1]),
            ],
          },
          distanceField: 'distance',
          maxDistance: 10000,
          spherical: true,
        },
      },
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'reservations',
          localField: '_id',
          foreignField: 'listingId',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { reservations: { $eq: [] } },
            {
              reservations: {
                $not: {
                  $elemMatch: {
                    startDate: { $lt: endDate },
                    endDate: { $gt: startDate },
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    let filteredListings = listingsAvailable;

    if (buildingType) {
      filteredListings = filteredListings.filter(
        (building) => building.buildingType === buildingType,
      );
    }

    let amenitiesArray = [];
    if (typeof amenities === 'string') {
      amenitiesArray = [amenities];
    } else if (Array.isArray(amenities)) {
      amenitiesArray = amenities;
    }

    if (amenitiesArray.length > 0) {
      filteredListings = filteredListings.filter((building) =>
        amenitiesArray.every((amenity) => building.amenities.includes(amenity)),
      );
    }

    res.status(200).json(filteredListings);
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

export const getFreeDates = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).send({ message: 'Please enter listingId' });
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    const startOfMonth = new Date(Date.UTC(year, month, 1));
    const endOfMonth = new Date(Date.UTC(year, month + 1, 0));

    console.log('Start of Month:', startOfMonth.toISOString());
    console.log('End of Month:', endOfMonth.toISOString());

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const startDate = today > startOfMonth ? today : startOfMonth;
    console.log(startDate);

    const result = await Listing.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'reservations',
          localField: '_id',
          foreignField: 'listingId',
          as: 'reservations',
        },
      },
      {
        $unwind: {
          path: '$reservations',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { 'reservations.startDate': { $lte: endOfMonth } },
            { 'reservations.endDate': { $gte: startDate } },
          ],
        },
      },
      {
        $group: {
          _id: '$_id',
          reservations: {
            $push: {
              startDate: '$reservations.startDate',
              endDate: '$reservations.endDate',
            },
          },
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).send({ message: 'Listing not found.' });
    }

    const reservations = result[0].reservations;

    const allDatesInMonth = [];
    for (let day = startDate.getDate(); day <= endOfMonth.getDate(); day++) {
      console.log(day);

      allDatesInMonth.push(
        new Date(year, month, day).toISOString().split('T')[0],
      );
    }

    const bookedDates = new Set();
    reservations.forEach((reservation) => {
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      let currentDate = new Date(start);
      while (currentDate <= end) {
        bookedDates.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    const freeDates = allDatesInMonth.filter((date) => !bookedDates.has(date));

    res.status(200).send({ freeDates });
  } catch (error) {
    next(new RealEstateErrors(error.message || 'Failed to get free dates.'));
  }
};
