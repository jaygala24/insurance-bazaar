import React, { Component } from 'react';
import axios from 'axios';

class Policy extends Component {
  state = {
    user: {},
    policies: [],
    claimAmt: '',
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
    let policies = user.policies['health'];
    policies = policies.concat(user.policies['life']);
    policies = policies.concat(user.policies['travel']);
    policies = policies.concat(user.policies['vehicle']);
    this.setState({ user, policies });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getType = p_refid => {
    if (p_refid.startsWith('HI')) return 'Health';
    else if (p_refid.startsWith('LI')) return 'Life';
    else if (p_refid.startsWith('TI')) return 'Travel';
    return 'Vehicle';
  };

  getSanc = p_refid => {
    if (
      p_refid.startsWith('HI') ||
      p_refid.startsWith('TI') ||
      p_refid.startsWith('VI')
    )
      return true;
    return false;
  };

  onSubmit = async (e, policy_no) => {
    e.preventDefault();
    const { claimAmt } = this.state;
    if (!claimAmt) {
      this.setState({ error: true });
    } else {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `http://localhost:5000/api/policy/claim`,
        {
          policy_no,
          claim_amount: claimAmt,
        },
        {
          headers: {
            Authorization: token,
          },
        },
      );
      alert('Claim Request Sent');
      this.setState({ error: false, claimAmt: '' });
      this.props.history.push('/policy');
    }
  };

  render() {
    const { name } = this.state.user;
    const { policies, error, claimAmt } = this.state;

    let table = policies.map(policy => {
      return (
        <tr key={policy.p_refid}>
          <td>{policy.p_refid}</td>
          <td>
            {policy.bname} - {policy.pname}
          </td>
          <td>{policy.assured_amount}</td>
          <td>{policy.period} year</td>
          <td>{this.getType(policy.p_refid)}</td>
          <td>
            {this.getSanc(policy.p_refid) ? (
              <a
                href="/health"
                onClick={e => this.onSubmit(e, policy.policy_no)}
                className="badge badge-default p-2"
              >
                Claim
              </a>
            ) : null}
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
                  <h3 className="mb-0">Policies</h3>
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
                            placeholder="Claim Amount"
                            type="number"
                            name="claimAmt"
                            value={claimAmt}
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
                          <th scope="col">Assured Amount</th>
                          <th scope="col">Period</th>
                          <th scope="col">Type</th>
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

export default Policy;
