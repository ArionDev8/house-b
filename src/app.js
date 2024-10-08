import 'dotenv/config';
import express from 'express';
import './db.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import mongoose from 'mongoose';
import { RealEstateErrors } from './utils/ErrorHandler.js';
import qs from 'qs';

const app = express();
app.set('query parser', function (str) {
  return qs.parse(str, { comma: true });
});
app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/listings', listingRoutes);
app.use('/reviews', reviewRoutes);
app.use('/reservations', reservationRoutes);
app.get('/health', (req, res) => {
  if (mongoose.connection.readyState === 1) {
    res.status(200).end();
  } else {
    res.status(500).end();
  }
});

app.use('/static', express.static('src/Images'));
app.use((err, req, res, _next) => {
  if (err instanceof RealEstateErrors) {
    res.status(err.code);
    res.send({ message: err.publicMsg, error: true });
    console.error(err.message);

    return;
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(5000, () => {
  console.log('App listening on port 5000');
});
