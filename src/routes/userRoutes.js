import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getMe,
  addToFavorites,
  removeFromFavorites,
  getFavoriteListings,
} from '../controllers/userController.js';
import { validate, authenticateJWT } from '../utils/validationMiddleware.js';
import {
  newUserSchema,
  updateUserSchema,
  loginUserSchema,
} from '../models/User.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post('/signup', validate('body', newUserSchema), createUser);
router.post('/login', validate('body', loginUserSchema), loginUser);
router.post('/add-to-favorites/:listingId', authenticateJWT, addToFavorites);
router.get('/me', authenticateJWT, getMe);
router.get('/', getAllUsers);
router.get('/allFavorites', authenticateJWT, getFavoriteListings);
router.get('/:id', getUserById);
router.put(
  '/',
  authenticateJWT,
  validate('body', updateUserSchema),
  updateUser,
);
router.delete(
  '/remove-from-favourites/:listingId',
  authenticateJWT,
  removeFromFavorites,
);
router.delete(
  '/:id',
  authenticateJWT,
  validate('params', ObjectIdParam),
  deleteUser,
);

export default router;
