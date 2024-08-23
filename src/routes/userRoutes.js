import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
} from '../controllers/userController.js';
import { validate, authenticateJWT } from '../utils/validationMiddleware.js';
import {
  newUserSchema,
  updateUserSchema,
  loginUserSchema,
} from '../models/User.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post('/', validate('body', newUserSchema), createUser);
router.post('/login', validate('body', loginUserSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put(
  '/:id',
  authenticateJWT,
  validate('body', updateUserSchema),
  validate('params', ObjectIdParam),
  updateUser,
);
router.delete(
  '/:id',
  authenticateJWT,
  validate('params', ObjectIdParam),
  deleteUser,
);

export default router;
