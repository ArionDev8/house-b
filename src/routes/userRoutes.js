import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { validate } from '../utils/validationMiddleware.js';
import { newUserCreate, updateUserSchema } from '../models/User.js';
import { ObjectIdParam } from '../utils/ObjectIdUtils.js';

const router = express.Router();

router.post('/', validate('body', newUserCreate), createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put(
  '/:id',
  validate('body', updateUserSchema),
  validate('params', ObjectIdParam),
  updateUser,
);
router.delete('/:id', deleteUser);

export default router;
