import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { secrets } from '../config/keys';
import db from '../config/db';

export const newToken = user => {
  return jwt.sign({ id: user._id }, secrets.jwt, {
    expiresIn: secrets.jwtExp,
  });
};

export const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

export const genHashPassword = plainPassword => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, 10, function(err, hash) {
      if (err) return reject(err);
      resolve(hash);
    });
  });
};

export const cmpPassword = (plainPassword, hashPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashPassword, function(
      err,
      isMatch,
    ) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).json({
      data: { success: false },
      errors: {
        authorization: 'Access token required',
      },
    });
  }

  try {
    const token = bearer.split('Bearer ')[1].trim();
    const payload = await verifyToken(token);
    const sql = `SELECT cust_id as _id, name, email, phone_no, address, DATE_FORMAT(dob,'%Y-%m-%d') as dob, password FROM customer WHERE cust_id=${payload.id}`;
    const [rows, fields] = await db.execute(sql);
    const user = rows[0];
    user.password = null;
    if (!user) {
      return next(err);
    }
    req.user = user;
    next();
  } catch (err) {
    return next(err);
  }
};
