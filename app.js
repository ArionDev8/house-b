import express from 'express';
import { connectToDb, getDb } from './db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

connectToDb((error) => {
  if (!error) {
    app.get('/health', (req, res) => {
      res.json('200 OK');
    });
    getDb();
  }
});

app.listen(5000, () => {
  console.log('App listening on port 5000');
});


