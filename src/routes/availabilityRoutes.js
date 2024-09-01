import express from 'express';
import {
  createAvailability,
  getAvailabilityForAListing,
} from '../controllers/availabilityController.js';
import { validate, authenticateJWT } from '../utils/validationMiddleware.js';
import { newAvailabilitySchema } from '../models/Availability.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post(
  '/:id',
  authenticateJWT,
  validate('body', newAvailabilitySchema),
  validate('params', ObjectIdParam),
  createAvailability,
);
router.get(
  '/:id/all',
  validate('params', ObjectIdParam),
  getAvailabilityForAListing,
);

export default router;
