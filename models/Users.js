import mongoose from 'mongoose';
const {Schema} = mongoose;

const usersSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'],
        required: true 
      }
});

export const Users = mongoose.model('Users',usersSchema);