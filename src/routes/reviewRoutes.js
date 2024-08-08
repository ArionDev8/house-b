import express from 'express';
import {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { validate } from '../utils/validationMiddleware.js';
import { newReviewSchema, updateReviewSchema } from '../models/Review.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post('/', validate('body', newReviewSchema), createReview);
router.get('/', getAllReviews);
router.put(
  '/:id',
  validate('body', updateReviewSchema),
  validate('params', ObjectIdParam),
  updateReview,
);
router.delete('/:id', validate('params', ObjectIdParam), deleteReview);

export default router;
