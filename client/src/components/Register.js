import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    address: '',
    phoneNo: '',
    DOB: '',
  };

  componentDidMount() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.props.history.push('/');
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      password2,
      address,
      DOB,
      phoneNo,
    } = this.state;
    if (password !== password2) {
      alert('Password do not match');
      this.setState({ password: '', password2: '' });
    } else {
      const res = await axios.post(
        `http://localhost:5000/api/auth/register`,
        {
          name,
          email,
          phoneNo,
          password,
          address,
          DOB,
        },
      );
      if (res.data.msg) {
        this.props.history.push('/login');
      } else {
        this.setState({
          name: '',
          email: '',
          password: '',
          password2: '',
          address: '',
          phoneNo: '',
          DOB: '',
        });
      }
    }
  };

  render() {
    const {
      name,
      email,
      password,
      password2,
      address,
      DOB,
      phoneNo,
    } = this.state;
    return (
      <React.Fragment>
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="card bg-secondary shadow border-0">
                <div className="card-body px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <h1>Sign Up</h1>
                  </div>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group mb-3">
                      <div className="input-group input-group-alternative">
                        <input
                          className="form-control"
                          placeholder="Name"
                          type="text"
                          name="name"
                          value={name}
                          onChange={this.onChange}
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <div className="input-group input-group-alternative">
                        <input
                          className="form-control"
                          placeholder="Email"
                          type="email"
                          name="email"
                          value={email}
                          onChange={this.onChange}
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <div className="input-group input-group-alternative">
                        <input
                          className="form-control"
                          placeholder="Address"
                          type="text"
                          name="address"
                          value={address}
                          onChange={this.onChange}
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <div className="input-group input-group-alternative">
                        <input
                          className="form-control"
                          placeholder="Phone No (10 digits)"
                          type="text"
                          name="phoneNo"
                          value={phoneNo}
                          onChange={this.onChange}
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group input-group-alternative">
                        <input
                          className="form-control"
                          placeholder="Date of Birth"
                          type="date"
                          name="DOB"
                          value={DOB}
                          onChange={this.onChange}
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group input-group-alternative">
                        <input
                          className="form-control"
                          placeholder="Password"
                          type="password"
                          name="password"
                          value={password}
                          onChange={this.onChange}
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group input-group-alternative">
                        <input
                          className="form-control"
                          placeholder="Confirm Password"
                          type="password"
                          name="password2"
                          value={password2}
                          onChange={this.onChange}
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <input
                        type="submit"
                        className="btn btn-primary my-4"
                        value="Sign Up"
                      />
                    </div>
                  </form>
                  <div className="row mt-3">
                    <div className="col text-center">
                      <Link to="/login" className="text-light">
                        <p className="text-md-center">
                          Already have an account
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
