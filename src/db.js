import mongoose from 'mongoose';

const url = process.env.MONGO_URL;
console.log(url);

mongoose
  .connect(url)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });

mongoose.set('debug', true);
