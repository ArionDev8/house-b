import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getMe,
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
router.get('/me', authenticateJWT, getMe);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put(
  '/',
  authenticateJWT,
  validate('body', updateUserSchema),
  updateUser,
);
router.delete(
  '/:id',
  authenticateJWT,
  validate('params', ObjectIdParam),
  deleteUser,
);

export default router;
