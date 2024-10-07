import express from 'express';
import {
  createReservation,
  getAllReservations,
  updateReservation,
  deleteReservation,
  getReservationsByListing,
  getAllReservationsOfAUser,
  getOneReservationOfAUser,
} from '../controllers/reservationController.js';
import { validate, authenticateJWT } from '../utils/validationMiddleware.js';
import {
  newReservationSchema,
  updateReservationSchema,
} from '../models/Reservation.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post(
  '/:listingId',
  authenticateJWT,
  validate('body', newReservationSchema),
  createReservation,
);
router.get(
  '/allReservationsOfAUser',
  authenticateJWT,
  getAllReservationsOfAUser,
);
router.get('/', authenticateJWT, getAllReservations);
router.get('/one/:listingId', authenticateJWT, getOneReservationOfAUser);
router.get('/:listingId', authenticateJWT, getReservationsByListing);
router.put(
  '/:id',
  authenticateJWT,
  validate('body', updateReservationSchema),
  validate('params', ObjectIdParam),
  updateReservation,
);
router.delete(
  '/:id',
  authenticateJWT,
  validate('params', ObjectIdParam),
  deleteReservation,
);

export default router;
