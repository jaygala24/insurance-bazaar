import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import db from './config/db';

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({
    data: {
      success: true,
      message:
        'Welcome to Node.js & Express API for Insurance Bazaar',
    },
  });
});

app.get('/test', async (req, res) => {
  const sql = `CREATE DATABASE mydb`;
  try {
    const [rows, fields] = await db.execute(sql);
    return res
      .status(200)
      .json({ message: 'mydb test database created.' });
  } catch (err) {
    if (err) next(err);
  }
});

// Error Handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    data: { success: false, message: null },
    error: { message: err.message },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
