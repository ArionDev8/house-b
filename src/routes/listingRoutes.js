import express from 'express';
import {
  createListing,
  getAllListings,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { validate } from '../utils/validationMiddleware.js';
import { newListingSchema } from '../models/Listing.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post('/', validate('body', newListingSchema), createListing);
router.get('/', getAllListings);
router.put('/:id', validate('params', ObjectIdParam), updateListing);
router.delete('/:id', validate('params', ObjectIdParam), deleteListing);

export default router;
