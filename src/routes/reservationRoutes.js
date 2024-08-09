import express from 'express';
import {
  createReservation,
  getAllReservations,
  updateReservation,
  deleteReservation,
} from '../controllers/reservationController.js';
import { validate } from '../utils/validationMiddleware.js';
import {
  newReservationSchema,
  updateReservationSchema,
} from '../models/Reservation.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post('/', validate('body', newReservationSchema), createReservation);
router.get('/', getAllReservations);
router.put(
  '/:id',
  validate('body', updateReservationSchema),
  validate('params', ObjectIdParam),
  updateReservation,
);
router.delete('/:id', validate('params', ObjectIdParam), deleteReservation);

export default router;
