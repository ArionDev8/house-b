import {Users} from '../models/Users.js';

//create a new user
export const createUser = async (req, res ) => {
    try{    
        const {firstName, lastName, email, password, role} = req.body;
        const newUser = new Users({firstName,lastName,email,password,role});
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    }catch(error){
        res.status(400).json({ message: error.message });
    }
} 

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, password, role },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await Users.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};