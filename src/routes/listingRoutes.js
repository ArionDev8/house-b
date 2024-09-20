import express from 'express';
import multer from 'multer';
import { storage } from '../utils/ImageUploader.js';
import {
  createListing,
  uploadImages,
  searchListings,
  getAllYourListings,
  getOneListing,
  updateListing,
  deleteListing,
  pagination,
  getFreeDates,
  getOneListingWithoutAuth,
  deleteImage,
} from '../controllers/listingController.js';
import { validate, authenticateJWT } from '../utils/validationMiddleware.js';
import { newListingSchema, searchSchema } from '../models/Listing.js';
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
router.delete('/:listingId/images/:id', authenticateJWT, deleteImage);
router.get('/search', validate('query', searchSchema), searchListings);
router.get('/yourListings', authenticateJWT, getAllYourListings);
router.get(
  '/available/:listingId',
  validate('params', ObjectIdParam),
  getFreeDates,
);
router.get(
  '/noauth/:id',
  validate('params', ObjectIdParam),
  getOneListingWithoutAuth,
);
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
