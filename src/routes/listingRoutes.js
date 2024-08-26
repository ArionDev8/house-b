import express from 'express';
import {
  createListing,
  getAllListings,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { validate, authenticateJWT } from '../utils/validationMiddleware.js';
import { newListingSchema } from '../models/Listing.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post(
  '/',
  authenticateJWT,
  validate('body', newListingSchema),
  createListing,
);
router.get('/', getAllListings);
router.put(
  '/:id',
  authenticateJWT,
  validate('params', ObjectIdParam),
  updateListing,
);
router.delete(
  '/:id',
  authenticateJWT,
  validate('params', ObjectIdParam),
  deleteListing,
);

export default router;
