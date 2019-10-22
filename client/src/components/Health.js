import React, { Component } from 'react';
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

class Health extends Component {
  state = {
    user: {},
    health: [],
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
    const health = user.policies['health'].map(
      policy => policy.p_refid,
    );
    user['healthPolicy'] = health.join();
    const policy = await axios.get(
      `http://localhost:5000/api/policies?type=health`,
    );
    this.setState({ user, health: policy.data });
  }

  logout = () => {
    this.setState({ user: {} });
    localStorage.removeItem('authToken');
    this.props.history.push('/login');
  };

  onSubmit = async (e, p_refid) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    await axios.get(
      `http://localhost:5000/api/policy/health?id=${p_refid}`,
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
    user['age'] = getAge(res.data.dob);
    const health = user.policies['health'].map(
      policy => policy.p_refid,
    );
    user['healthPolicy'] = health.join();
    this.setState({ user });
  };

  render() {
    const { name, age, healthPolicy } = this.state.user;
    const { health } = this.state;

    let table = health.map(policy => {
      if (policy.age > age) {
        return (
          <tr key={policy.p_refid}>
            <td>{policy.p_refid}</td>
            <td>
              {policy.bname} - {policy.pname}
            </td>
            <td>{policy.assured_amount}</td>
            <td>{policy.period} year</td>
            <td>
              {healthPolicy.includes(policy.p_refid) ? (
                <span className="badge badge-success p-2">
                  Purchased
                </span>
              ) : (
                <a
                  href="/health"
                  onClick={e => this.onSubmit(e, policy.p_refid)}
                  className="badge badge-default"
                >
                  Buy Policy
                </a>
              )}
            </td>
          </tr>
        );
      }
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
                  <h3 className="mb-0">Health Policies</h3>
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

export default Health;
