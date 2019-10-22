import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const getAge = dateString => {
  let today = new Date();
  let birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

class Dashboard extends Component {
  state = {
    user: {},
  };

  async componentDidMount() {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(
      `http://localhost:5000/api/auth/user`,
      {
        headers: { Authorization: token },
      },
    );
    const user = res.data;
    user['age'] = getAge(res.data.dob);
    this.setState({ user });
  }

  logout = () => {
    this.setState({ user: {} });
    localStorage.removeItem('authToken');
    this.props.history.push('/login');
  };

  render() {
    const { name } = this.state.user;
    return (
      <React.Fragment>
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-6">
              <div className="card border-0">
                <div className="card-body px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <h1>Welcome {name}</h1>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="text-center text-muted mb-4">
                        <Link
                          to="/policy"
                          className="btn btn-primary text-uppercase"
                        >
                          My Policy
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="text-center text-muted mb-4">
                        <Link
                          to="/claim-status"
                          className="btn btn-primary text-uppercase"
                        >
                          Claim Status
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="text-center text-muted mb-4">
                        <p
                          className="btn btn-primary text-uppercase"
                          onClick={this.logout}
                        >
                          logout
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row justify-content-center">
                    <div className="col-lg-8">
                      <div className="row row-grid">
                        <div className="col-lg-6">
                          <div className="card card-lift--hover shadow border-0">
                            <div className="card-body py-5">
                              <h6 className="h2 font-weight-bold text-primary text-uppercase">
                                Health
                              </h6>
                              <p className="description mt-3">
                                Be the first to unlock the power of
                                health policy and secure your future
                              </p>
                              <Link
                                to="/health"
                                className="btn btn-primary mt-2"
                              >
                                Learn more
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="card card-lift--hover shadow border-0">
                            <div className="card-body py-5">
                              <h6 className="h2 font-weight-bold text-success text-uppercase">
                                Life
                              </h6>
                              <p className="description mt-3">
                                Be the first to unlock the power of
                                life policy and secure your future
                              </p>
                              <a
                                href="/life"
                                className="btn btn-success mt-2"
                              >
                                Learn more
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="card card-lift--hover shadow border-0">
                            <div className="card-body py-5">
                              <h6 className="h2 font-weight-bold text-warning text-uppercase">
                                Travel
                              </h6>
                              <p className="description mt-3">
                                Be the first to unlock the power of
                                travel policy and secure your future
                              </p>
                              <a
                                href="/travel"
                                className="btn btn-warning mt-4"
                              >
                                Learn more
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="card card-lift--hover shadow border-0">
                            <div className="card-body py-5">
                              <h6 className="h2 font-weight-bold text-default text-uppercase">
                                Vehicle
                              </h6>
                              <p className="description mt-3">
                                Be the first to unlock the power of
                                vehicle policy and secure your future
                              </p>
                              <a
                                href="/vehicle"
                                className="btn btn-default mt-4"
                              >
                                Learn more
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default Dashboard;
