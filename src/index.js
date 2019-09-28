import express from 'express';
import { urlencoded, json } from 'body-parser';
import mysql from 'mysql';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Database Setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  // database: 'insurance_data',
});

db.connect(err => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected insurance database as id: ' + db.threadId);
});

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

app.get('/test', (req, res) => {
  const sql = `CREATE DATABASE mydb`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    return res
      .status(200)
      .json({ message: 'mydb test database created.' });
  });
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
