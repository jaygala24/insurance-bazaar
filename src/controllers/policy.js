import db from '../config/db';

export const getPolicies = async (req, res) => {
  const { type } = req.query;
  let sql;
  switch (type) {
    case 'health':
      sql = `SELECT * FROM insurance_data.brand_ref NATURAL JOIN insurance_data.health_ref;`;
      break;
    case 'life':
      sql = `SELECT * FROM insurance_data.brand_ref NATURAL JOIN insurance_data.life_ref;`;
      break;
    case 'vehicle':
      sql = `SELECT * FROM insurance_data.brand_ref INNER JOIN insurance_data.vehicle_ref ON insurance_data.vehicle_ref.p_refid=insurance_data.brand_ref.p_refid;`;
      break;
    case 'travel':
      sql = `SELECT * FROM insurance_data.brand_ref NATURAL JOIN insurance_data.travel_ref;`;
      break;
    default:
      sql = `SELECT * FROM insurance_data.brand_ref`;
  }

  try {
    const [rows, fields] = await db.execute(sql);
    const policies = rows;
    return res.status(200).send(policies);
  } catch (err) {
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const buyHealthPolicy = async (req, res) => {
  const { id } = req.query;
  let sql = `SELECT * FROM insurance_data.brand_ref WHERE p_refid='${id}';`;
  let date = new Date();
  const policy = {};

  try {
    let [rows, fields] = await db.execute(sql);
    policy['pname'] = rows[0].pname;
    policy['premium'] = rows[0].premium;
    sql = `INSERT INTO insurance_data.policy (p_refid, dop, paid, cust_id) VALUES (?, ?, ?, ?);`;
    const data = [
      id,
      `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      policy.premium,
      req.user._id,
    ];

    [rows, fields] = await db.execute(sql, data);
    return res.status(201).send({
      success: true,
      msg: `Policy '${policy.pname}' successfully purchased`,
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const buyLifePolicy = async (req, res) => {
  const { id, name, relation } = req.body;
  let sql = `SELECT * FROM insurance_data.brand_ref WHERE p_refid='${id}';`;
  let date = new Date();
  const policy = {};

  try {
    let [rows, fields] = await db.execute(sql);
    policy['pname'] = rows[0].pname;
    policy['premium'] = rows[0].premium;
    sql = `INSERT INTO insurance_data.policy (p_refid, dop, paid, cust_id) VALUES (?, ?, ?, ?);`;
    let data = [
      id,
      `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      policy.premium,
      req.user._id,
    ];
    [rows, fields] = await db.execute(sql, data);
    sql = `SELECT policy_no FROM insurance_data.policy WHERE cust_id=${req.user._id} AND p_refid='${id}';`;
    [rows, fields] = await db.execute(sql);
    policy['policy_no'] = rows[0].policy_no;
    sql = `INSERT INTO insurance_data.nominee (policy_no, name, relation) VALUES (?, ?, ?);`;
    data = [policy.policy_no, name, relation];
    [rows, fields] = await db.execute(sql, data);
    res.status(201).json({
      success: true,
      msg: `Policy '${policy.pname}' successfully purchased`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const buyVehiclePolicy = async (req, res) => {
  const { id, license_no, reg_no } = req.body;
  let sql = `SELECT * FROM insurance_data.brand_ref WHERE p_refid='${id}';`;
  let date = new Date();
  const policy = {};

  try {
    let [rows, fields] = await db.execute(sql);
    policy['pname'] = rows[0].pname;
    policy['premium'] = rows[0].premium;
    sql = `INSERT INTO insurance_data.policy (p_refid, dop, paid, cust_id) VALUES (?, ?, ?, ?);`;
    let data = [
      id,
      `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      policy.premium,
      req.user._id,
    ];
    [rows, fields] = await db.execute(sql, data);
    sql = `SELECT policy_no FROM insurance_data.policy WHERE cust_id=${req.user._id} AND p_refid='${id}';`;
    [rows, fields] = await db.execute(sql);
    policy['policy_no'] = rows[0].policy_no;
    sql = `INSERT INTO insurance_data.vehicle_details (policy_no, license_no, reg_no) VALUES (?, ?, ?);`;
    data = [policy.policy_no, license_no, reg_no];
    [rows, fields] = await db.execute(sql, data);
    res.status(201).json({
      success: true,
      msg: `Policy '${policy.pname}' successfully purchased`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const buyTravelPolicy = async (req, res) => {
  const { id, passport, destination, period } = req.body;
  let sql = `SELECT * FROM insurance_data.brand_ref WHERE p_refid='${id}';`;
  let date = new Date();
  const policy = {};

  try {
    let [rows, fields] = await db.execute(sql);
    policy['pname'] = rows[0].pname;
    policy['premium'] = rows[0].premium * period;
    sql = `INSERT INTO insurance_data.policy (p_refid, dop, paid, cust_id) VALUES (?, ?, ?, ?);`;
    let data = [
      id,
      `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      policy.premium,
      req.user._id,
    ];
    [rows, fields] = await db.execute(sql, data);
    sql = `SELECT policy_no FROM insurance_data.policy WHERE cust_id=${req.user._id} AND p_refid='${id}';`;
    [rows, fields] = await db.execute(sql);
    policy['policy_no'] = rows[0].policy_no;
    sql = `INSERT INTO insurance_data.travel_details (policy_no, passport, destination, period) VALUES (?, ?, ?, ?);`;
    data = [policy.policy_no, passport, destination, period];
    [rows, fields] = await db.execute(sql, data);
    res.status(201).json({
      success: true,
      msg: `Policy '${policy.pname}' successfully purchased`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const requestClaim = async (req, res) => {
  const { policy_no, claim_amount } = req.body;
  const date = new Date();
  try {
    let sql = `INSERT INTO insurance_data.claim_req (policy_no, claim_amount, claim_date, sanc) VALUES(?, ?, ?, ?);`;
    const data = [
      policy_no,
      claim_amount,
      `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,
      0,
    ];
    const [rows, fields] = await db.execute(sql, data);
    return res.status(201).json({
      msg: 'Claim Request Successful',
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const getClaimDetails = async (req, res) => {
  try {
    let sql = `SELECT * FROM insurance_data.claim_req INNER JOIN insurance_data.policy ON insurance_data.claim_req.policy_no=insurance_data.policy.policy_no WHERE cust_id=${req.user._id};`;
    const [rows, fields] = await db.execute(sql);
    const policies = rows;
    return res.status(200).json(policies);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};
