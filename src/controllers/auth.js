import db from '../config/db';
import validateLoginInput from '../validation/login';
import validateRegisterInput from '../validation/register';
import { newToken, genHashPassword, cmpPassword } from './utils';

export const register = async (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json({ data: { success: false }, errors });
  }

  try {
    let sql = `SELECT COUNT(*) as c FROM insurance_data.customer WHERE email='${req.body.email}'`;
    let [rows, fields] = await db.execute(sql);
    if (rows[0].c !== 0) {
      errors.email = 'Email already registered';
      return res.status(403).json({
        data: { success: false },
        errors,
      });
    }

    const hashPassword = await genHashPassword(req.body.password);
    const data = [
      req.body.name,
      req.body.email,
      hashPassword,
      req.body.DOB,
      req.body.phoneNo,
      req.body.address,
    ];

    sql = `INSERT INTO insurance_data.customer (name, email, password, dob, phone_no, address) VALUES(?, ?, ?, ?, ?, ?)`;
    [rows, fields] = await db.execute(sql, data);
    console.log(rows);
    return res.status(201).json({
      data: {
        success: true,
        message: 'Successfully registered',
      },
      errors,
    });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json({ data: { success: false }, errors });
  }

  try {
    const sql = `SELECT cust_id as _id, name, email, phone_no, address, DATE_FORMAT(dob,'%Y-%m-%d') as dob, password  FROM insurance_data.customer WHERE email='${req.body.email}'`;
    const [rows, fields] = await db.execute(sql);
    const user = rows[0];
    if (!user) {
      errors.email = 'User not found';
      return res
        .status(401)
        .json({ data: { success: false }, errors });
    }
    const isMatch = await cmpPassword(
      req.body.password,
      user.password,
    );
    if (!isMatch) {
      errors.password = 'Incorrect Password';
      return res
        .status(401)
        .json({ data: { success: false }, errors });
    }
    const token = newToken(user);
    return res.status(200).json({
      data: {
        success: true,
        token,
        user: { ...user, password: null },
      },
      errors,
    });
  } catch (err) {
    return next(err);
  }
};

export const getDetails = async (req, res) => {
  return res.status(200).json({ user: req.user });
};
