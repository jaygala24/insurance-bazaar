import React, { Component } from 'react';
import axios from 'axios';

class ClaimStatus extends Component {
  state = {
    user: {},
    claims: [],
  };

  async componentDidMount() {
    const token = localStorage.getItem('authToken');
    const user = await axios.get(
      `http://localhost:5000/api/auth/user`,
      {
        headers: { Authorization: token },
      },
    );
    const claim = await axios.get(
      `http://localhost:5000/api/policy/claim`,
      { headers: { Authorization: token } },
    );
    this.setState({ user: user.data, claims: claim.data });
  }

  logout = () => {
    this.setState({ user: {} });
    localStorage.removeItem('authToken');
    this.props.history.push('/login');
  };

  getStatus = sanc => {
    if (sanc === 1)
      return <span class="badge badge-success">Approved</span>;
    else if (sanc === 0)
      return <span class="badge badge-default">Pending</span>;
    else return <span class="badge badge-danger">Rejected</span>;
  };

  convertDate = dateString => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return `${year} - ${month} - ${day}`;
  };

  render() {
    const { name } = this.state.user;
    const { claims } = this.state;

    let table = claims.map((claim, index) => {
      return (
        <tr key={index}>
          <td>{claim.p_refid}</td>
          <td>{claim.policy_no}</td>
          <td>{this.convertDate(claim.claim_date)}</td>
          <td>{claim.claim_amount}</td>
          <td>{this.getStatus(claim.sanc)}</td>
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
                  <h3 className="mb-0">Claim Status</h3>
                </div>
                {table.length ? (
                  <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                      <thead className="thead-light">
                        <tr>
                          <th scope="col">Policy ID</th>
                          <th scope="col">Policy No</th>
                          <th scope="col">Claim Date</th>
                          <th scope="col">Claim Amount</th>
                          <th scope="col">Status</th>
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

export default ClaimStatus;
