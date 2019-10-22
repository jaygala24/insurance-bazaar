import db from '../config/db';
import validateLoginInput from '../validation/login';
import validateRegisterInput from '../validation/register';
import { newToken, genHashPassword, cmpPassword } from './utils';

export const register = async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    let sql = `SELECT COUNT(*) as c FROM insurance_data.customer WHERE email='${req.body.email}';`;
    let [rows, fields] = await db.execute(sql);
    if (rows[0].c !== 0) {
      errors.email = 'Email already registered';
      return res.status(400).json(errors);
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

    sql = `INSERT INTO insurance_data.customer (name, email, password, dob, phone_no, address) VALUES(?, ?, ?, ?, ?, ?);`;
    [rows, fields] = await db.execute(sql, data);
    console.log(rows);
    return res.status(201).json({
      msg: 'Successfully registered',
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const login = async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const sql = `SELECT cust_id as _id, name, email, phone_no, address, DATE_FORMAT(dob,'%Y-%m-%d') as dob, password  FROM insurance_data.customer WHERE email='${req.body.email}';`;
    const [rows, fields] = await db.execute(sql);
    const user = rows[0];
    if (!user) {
      errors.email = 'User not found';
      return res.status(401).json(errors);
    }
    const isMatch = await cmpPassword(
      req.body.password,
      user.password,
    );
    if (!isMatch) {
      errors.password = 'Password incorrect';
      return res.status(401).json(errors);
    }
    const token = newToken(user);
    return res.status(200).json({
      success: true,
      token: 'Bearer ' + token,
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const getDetails = async (req, res) => {
  try {
    const sql = `SELECT * FROM insurance_data.policy INNER JOIN insurance_data.brand_ref ON insurance_data.policy.p_refid=insurance_data.brand_ref.p_refid WHERE cust_id=${req.user._id};`;
    const [rows, fields] = await db.execute(sql);
    const policies = {
      health: [],
      life: [],
      vehicle: [],
      travel: [],
    };
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].p_refid.startsWith('HI')) {
        policies['health'].push(rows[i]);
      } else if (rows[i].p_refid.startsWith('LI')) {
        policies['life'].push(rows[i]);
      } else if (rows[i].p_refid.startsWith('VI')) {
        policies['vehicle'].push(rows[i]);
      } else if (rows[i].p_refid.startsWith('TI')) {
        policies['travel'].push(rows[i]);
      }
    }
    return res.status(200).json({ ...req.user, policies });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

export const updateDetails = async (req, res) => {
  const { address, password } = req.body;
  try {
    const hashPassword = await genHashPassword(password);
    const sql = `UPDATE insurance_data.customer SET address='${address}',password='${hashPassword}' WHERE cust_id='${req.user._id}';`;
    console.log(sql);
    const [rows, fields] = await db.execute(sql);
    return res
      .status(200)
      .json({ msg: 'Details Updated Successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};
