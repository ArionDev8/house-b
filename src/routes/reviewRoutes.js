import express from 'express';
import {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewsByListing,
} from '../controllers/reviewController.js';
import { validate, authenticateJWT } from '../utils/validationMiddleware.js';
import { newReviewSchema, updateReviewSchema } from '../models/Review.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post(
  '/:listingId',
  authenticateJWT,
  validate('body', newReviewSchema),
  createReview,
);
router.get('/', getAllReviews);
router.get('/:listingId', authenticateJWT, getReviewsByListing);
router.put(
  '/:id',
  authenticateJWT,
  validate('body', updateReviewSchema),
  validate('params', ObjectIdParam),
  updateReview,
);
router.delete(
  '/:id',
  authenticateJWT,
  validate('params', ObjectIdParam),
  deleteReview,
);

export default router;
