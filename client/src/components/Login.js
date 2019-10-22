import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  componentDidMount() {
    const token = localStorage.getItem('authToken');
    console.log(token);
    if (token) {
      this.props.history.push('/');
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async e => {
    e.preventDefault();
    const { email, password } = this.state;
    const res = await axios.post(
      `http://localhost:5000/api/auth/login`,
      {
        email,
        password,
      },
    );
    localStorage.setItem('authToken', res.data.token);
    this.props.history.push('/');
  };

  render() {
    const { email, password } = this.state;
    return (
      <React.Fragment>
        <div className="container mt-8">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="card bg-secondary shadow border-0">
                <div className="card-body px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <h1>Sign In</h1>
                  </div>
                  <form onSubmit={this.onSubmit}>
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
                    <div className="text-center">
                      <input
                        type="submit"
                        className="btn btn-primary my-4"
                        value="Sign In"
                      />
                    </div>
                  </form>
                  <div className="row mt-3">
                    <div className="col text-center">
                      <Link to="/register" className="text-light">
                        <p className="text-md-center">
                          Create new account
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

export default Login;
