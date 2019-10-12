import Validator from 'validator';
import isEmpty from './is-empty';

const validateRegisterInput = data => {
  let errors = {};

  data.name = isEmpty(data.name) ? '' : data.name;
  data.email = isEmpty(data.email) ? '' : data.email;
  data.password = isEmpty(data.password) ? '' : data.password;
  data.phoneNo = isEmpty(data.phoneNo) ? '' : data.phoneNo;
  data.address = isEmpty(data.address) ? '' : data.address;
  data.DOB = isEmpty(data.DOB) ? '' : data.DOB;

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field required';
  }
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field required';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field required';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  }
  if (Validator.isEmpty(data.phoneNo)) {
    errors.phoneNo = 'Phone Number field required';
  }
  if (!Validator.isLength(data.phoneNo, { min: 8, max: 12 })) {
    errors.phoneNo = 'Phone number invalid';
  }
  if (Validator.isEmpty(data.address)) {
    errors.phoneNo = 'Address field required';
  }
  if (Validator.isEmpty(data.DOB)) {
    errors.DOB = 'Date Of Birth field required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateRegisterInput;
