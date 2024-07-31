import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/RealEstate';

const connectToDb = (callback) => {
  mongoose
    .connect(url)
    .then(() => {
      console.log('Successfully connected to MongoDB');
      callback(null);
    })
    .catch((error) => {
      console.error('Connection error:', error);
      callback(error);
    });
};

const getDb = () => mongoose.connection;

export { connectToDb, getDb };
