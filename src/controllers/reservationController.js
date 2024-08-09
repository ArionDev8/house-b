import mongoose from 'mongoose';
import { Reservation } from '../models/Reservation.js';
import { RealEstateErrors } from '../utils/ErrorHandler.js';

export const createReservation = async (req, res, next) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();

    const { _id, listingId, startDate, endDate } = reservation;
    res.status(200).send({ id: _id, listingId, startDate, endDate });
  } catch {
    next(new RealEstateErrors());
  }
};

export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find();
    const filteredReservations = reservations.map((reservation) => ({
      id: reservation._id,
      listingId: reservation.listingId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
    }));

    res.status(200).send(filteredReservations);
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
    const deletedReservation = await Reservation.findByIdAndDelete(
      new mongoose.Types.ObjectId(id),
    );

    if (!deletedReservation) {
      return res.status(404).send({ message: 'Reservation not found' });
    }

    res.status(200).send({ message: 'Reservation deleted successfully' });
  } catch (err) {
    next(err);
  }
};
