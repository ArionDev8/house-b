import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { Reservation } from '../models/Reservation.js';
import { RealEstateErrors } from '../utils/ErrorHandler.js';

export const createReview = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const reservation = await Reservation.findOne({ listingId });

    const dateForReview = new Date(
      reservation.endDate.getTime() + 24 * 60 * 60 * 1000,
    );
    dateForReview.setUTCHours(0, 0, 0, 0);

    const currentTime = new Date();
    currentTime.setUTCHours(0, 0, 0, 0);

    if (currentTime < dateForReview) {
      return res.status(400).send({
        message:
          'You can only leave a review 24 hours after the reservation end date.',
      });
    }

    const review = new Review({
      ...req.body,
      listingId,
      userId: req.user.id,
    });
    await review.save();
    res.status(200).send({ message: 'Review saved successfully' });
  } catch (error) {
    console.error('Error in createReview:', error);
    next(new RealEstateErrors());
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: 'listings',
          localField: 'listingId',
          foreignField: '_id',
          as: 'listingInfo',
        },
      },
      {
        $unwind: '$listingInfo',
      },
    ]);

    res.status(200).send(reviews);
  } catch (error) {
    console.error('Error in getAllReviews:', error);
    next(new RealEstateErrors());
  }
};

export const updateReview = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedReview) {
      return res.status(404).send({ message: 'Review not found' });
    }

    const { _id, stars, comment } = updatedReview;
    res.status(200).send({ id: _id, stars, comment });
  } catch {
    next(new RealEstateErrors());
  }
};

export const deleteReview = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send({ message: 'Invalid review ID' });
  }

  try {
    const deletedReview = await Review.findById(
      new mongoose.Types.ObjectId(id),
    );

    if (!deletedReview) {
      return res.status(404).send({ message: 'Review not found' });
    }

    if (deletedReview.isDeleted === true) {
      return res.status(400).send({ message: 'Review already deleted' });
    } else {
      deletedReview.isDeleted = true;

      await deletedReview.save();
    }

    res.status(200).send({ message: 'Review deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getReviewsByListing = async (req, res, next) => {
  const { listingId } = req.params;

  try {
    const reviews = await Review.find({ listingId });

    if (!reviews.length) {
      return res
        .status(200)
        .send({ message: 'No reviews found for this listing', data: [] });
    }

    const filteredReviews = reviews.map((review) => ({
      id: review._id,
      userId: review.userId,
      stars: review.stars,
      comment: review.comment,
    }));

    res
      .status(200)
      .send({ totalCount: filteredReviews.length, data: filteredReviews });
  } catch {
    next(new RealEstateErrors());
  }
};
