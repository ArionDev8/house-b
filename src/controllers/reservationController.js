import mongoose from 'mongoose';
import { Reservation } from '../models/Reservation.js';
import { Listing } from '../models/Listing.js';
import { RealEstateErrors } from '../utils/ErrorHandler.js';

export const createReservation = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const { listingId } = req.params;

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    const timeDifference = endDate.getTime() - startDate.getTime();

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (startDate.getTime() >= endDate.getTime()) {
      return res.status(400).send({ message: 'Bad Request' });
    }

    const listing = await Listing.findById(listingId).lean();

    if (req.user.id === listing.userId.toString()) {
      return res.status(403).send({
        message:
          'You are not authorized to make reservations for this listing.',
      });
    }

    const existingReservations = await Reservation.find({
      listingId,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate },
        },
        {
          startDate: { $lte: endDate, $gte: startDate },
          endDate: { $lte: endDate, $gte: startDate },
        },
      ],
    });

    if (existingReservations.length > 0) {
      return res.status(400).send({
        message: 'Reservation dates overlap with an existing reservation',
      });
    }

    const totalPrice = daysDifference * listing.price;
    const userId = req.user.id;
    const reservation = new Reservation({
      startDate,
      endDate,
      listingId,
      userId,
      totalPrice,
    });
    await reservation.save();

    res.status(200).send({
      id: reservation._id,
      listingId,
      userId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      totalPrice: reservation.totalPrice,
    });
  } catch {
    next(new RealEstateErrors());
  }
};

export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({});
    const totalCount = reservations.length;

    const filteredReservations = reservations.map((reservation) => ({
      data: [
        {
          id: reservation._id,
          listingId: reservation.listingId,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          isDeleted: reservation.isDeleted,
        },
      ],
    }));

    res
      .status(200)
      .send({ totalReservations: totalCount, filteredReservations });
  } catch {
    next(new RealEstateErrors());
  }
};

export const updateReservation = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updateReservation = await Reservation.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      },
    );

    if (!updateReservation) {
      return res.status(404).send({ message: 'Reservation not found' });
    }

    const { _id, startDate, endDate } = updateReservation;
    res.status(200).send({ id: _id, startDate, endDate });
  } catch {
    next(new RealEstateErrors());
  }
};

export const deleteReservation = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: 'Invalid reservation ID' });
  }

  try {
    const deletedReservation = await Reservation.findById(id);

    if (!deletedReservation) {
      return res.status(404).send({ message: 'Reservation not found' });
    }

    if (deletedReservation.isDeleted === true) {
      return res.status(400).send({ message: 'Reservation already deleted' });
    } else {
      deletedReservation.isDeleted = true;

      await deletedReservation.save();
    }
    res.status(200).send({ message: 'Reservation deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getReservationsByListing = async (req, res, next) => {
  const { listingId } = req.params;

  try {
    const reservations = await Reservation.find({ listingId });

    if (!reservations.length) {
      return res
        .status(200)
        .send({ message: 'No reservations found for this listing', data: [] });
    }

    const filteredReservations = reservations.map((reservation) => ({
      id: reservation._id,
      listingId: reservation.listingId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      isDeleted: reservation.isDeleted,
    }));

    res.status(200).send({
      totalCount: filteredReservations.length,
      data: filteredReservations,
    });
  } catch {
    next(new RealEstateErrors());
  }
};

export const getAllReservationsOfAUser = async (req, res, next) => {
  const { id } = req.user;

  try {
    const userObjectId = new mongoose.Types.ObjectId(id);
    const allReservations = await Listing.aggregate([
      {
        $lookup: {
          from: 'reservations',
          localField: '_id',
          foreignField: 'listingId',
          as: 'reservations',
        },
      },
      {
        $unwind: '$reservations',
      },
      {
        $match: {
          'reservations.userId': userObjectId,
        },
      },
    ]);

    console.log(allReservations);

    if (!allReservations) {
      res.status(404).send({ message: 'No reservations made' });
    }

    res.status(200).json(allReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    next(new RealEstateErrors());
  }
};

export const getOneReservationOfAUser = async (req, res, next) => {
  const { id } = req.user;
  const { listingId } = req.params;
  try {
    const userObjectId = new mongoose.Types.ObjectId(id);
    const reservation = await Listing.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(listingId) },
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
        $unwind: '$reservations',
      },
      {
        $match: {
          'reservations.userId': userObjectId,
        },
      },
    ]);

    console.log(reservation);

    if (reservation.length === 0) {
      res.status(404).send({ message: 'No reservation found! ' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    next(new RealEstateErrors());
  }
};
