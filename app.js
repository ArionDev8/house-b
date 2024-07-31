import express from 'express';
import { connectToDb, getDb } from './db.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);

connectToDb((error) => {
  if (!error) {
    app.listen(5000, () => {
      console.log('App listening on port 5000');
    });
    getDb();
  }
});

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome!' });
});
