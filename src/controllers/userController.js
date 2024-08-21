import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { RealEstateErrors } from '../utils/ErrorHandler.js';

export const createUser = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });
    await user.save();
    const { _id, firstName, lastName, email } = user;
    res.status(201).send({
      id: _id,
      firstName,
      lastName,
      email,
    });
  } catch {
    next(new RealEstateErrors());
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    const filteredUsers = users.map((user) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }));
    res.status(200).json(filteredUsers);
  } catch {
    next(new RealEstateErrors());
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { _id, firstName, lastName, email } = updatedUser;
    res.status(201).send({ id: _id, firstName, lastName, email });
  } catch {
    next(new RealEstateErrors());
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(
      new mongoose.Types.ObjectId(id),
    );
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err.message);
    next(err);
  }
};
