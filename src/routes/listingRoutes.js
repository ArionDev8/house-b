import express from 'express';
import multer from 'multer';
import { storage } from '../utils/ImageUploader.js';
import {
  createListing,
  uploadImages,
  getAllListings,
  getAllYourListings,
  getOneListing,
  updateListing,
  deleteListing,
  getAllNearListings,
  pagination,
} from '../controllers/listingController.js';
import { validate, authenticateJWT } from '../utils/validationMiddleware.js';
import { newListingSchema } from '../models/Listing.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();
const upload = multer({ storage: storage });

router.post(
  '/',
  authenticateJWT,
  validate('body', newListingSchema),
  createListing,
);
router.post(
  '/:listingId/images',
  authenticateJWT,
  upload.array('photos', 5),
  uploadImages,
);
router.get('/', getAllListings);
router.get('/nearby', getAllNearListings);
router.get('/yourListings', authenticateJWT, getAllYourListings);
router.get(
  '/:id',
  authenticateJWT,
  validate('params', ObjectIdParam),
  getOneListing,
);
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
router.get('/movies', authenticateJWT, pagination);

export default router;
