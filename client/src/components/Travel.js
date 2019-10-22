import React, { Component } from 'react';
import axios from 'axios';

class Travel extends Component {
  state = {
    user: {},
    travel: [],
    passport: '',
    period: '',
    error: false,
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
    const travel = user.policies['travel'].map(
      policy => policy.p_refid,
    );
    user['travelPolicy'] = travel.join();
    const policy = await axios.get(
      `http://localhost:5000/api/policies?type=travel`,
    );
    this.setState({ user, travel: policy.data });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  logout = () => {
    this.setState({ user: {} });
    localStorage.removeItem('authToken');
    this.props.history.push('/login');
  };

  onSubmit = async (e, p_refid, destination) => {
    e.preventDefault();
    const { passport, period } = this.state;
    if (!passport || !period) {
      this.setState({ error: true });
    } else {
      const token = localStorage.getItem('authToken');
      const resData = await axios.post(
        `http://localhost:5000/api/policy/travel`,
        {
          id: p_refid,
          passport,
          period,
          destination,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      const res = await axios.get(
        `http://localhost:5000/api/auth/user`,
        {
          headers: { Authorization: token },
        },
      );
      const user = res.data;
      const travel = user.policies['travel'].map(
        policy => policy.p_refid,
      );
      user['travelPolicy'] = travel.join();
      this.setState({
        user,
        passport: '',
        period: '',
        error: false,
      });
    }
  };

  render() {
    const { name, travelPolicy } = this.state.user;
    const { travel, passport, period, error } = this.state;

    let table = travel.map(policy => {
      return (
        <tr key={policy.p_refid}>
          <td>{policy.p_refid}</td>
          <td>
            {policy.bname} - {policy.pname}
          </td>
          <td>{policy.destination}</td>
          <td>{policy.assured_amount}</td>
          <td>{policy.period} year</td>
          <td>
            {travelPolicy.includes(policy.p_refid) ? (
              <span className="badge badge-success p-2">
                Purchased
              </span>
            ) : (
              <a
                href="/life"
                onClick={e =>
                  this.onSubmit(e, policy.p_refid, policy.destination)
                }
                className="badge badge-default"
              >
                Buy Policy
              </a>
            )}
          </td>
        </tr>
      );
    });

    return (
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow">
              <div className="card-body px-lg-2 py-lg-5">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="text-center text-muted mb-4">
                      <p
                        className="btn btn-primary text-uppercase"
                        onClick={() => this.props.history.push('/')}
                      >
                        home
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="text-center text-muted mb-4">
                      <h1>Welcome {name}</h1>
                    </div>
                  </div>
                  <div className="col-lg-3">
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
                <div className="card-header border-0">
                  <h3 className="mb-0">Travel Policies</h3>
                </div>
                <div className="card-body border-0">
                  {error ? (
                    <div className="row my-2">
                      <div className="col-lg-8">
                        <div
                          className="alert alert-primary alert-dismissible fade show"
                          role="alert"
                        >
                          <span className="alert-inner--text">
                            Please fill all the details
                          </span>
                          <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            aria-label="Close"
                            onClick={() =>
                              this.setState({ error: false })
                            }
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="form-group mb-3">
                        <div className="input-group input-group-alternative">
                          <input
                            className="form-control"
                            placeholder="Passport No."
                            type="text"
                            name="passport"
                            value={passport}
                            onChange={this.onChange}
                            required={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="form-group mb-3">
                        <div className="input-group input-group-alternative">
                          <input
                            className="form-control"
                            placeholder="Period(No of Days)"
                            type="text"
                            name="period"
                            value={period}
                            onChange={this.onChange}
                            required={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {table.length ? (
                  <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Policy ID</th>
                          <th scope="col">Policy Name</th>
                          <th scope="col">Destination</th>
                          <th scope="col">Assured Amount</th>
                          <th scope="col">Period</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>{table}</tbody>
                    </table>
                  </div>
                ) : (
                  <div className="card-body border-0">
                    <p className="mb-0">No Policies</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Travel;
