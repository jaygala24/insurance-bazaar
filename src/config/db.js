import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Database Setup
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'insurance_data',
});

pool.getConnection(err => {
  if (err) {
    console.error('Error connecting database');
    return;
  }
  console.log('Database connected...');
});

export default pool.promise();
