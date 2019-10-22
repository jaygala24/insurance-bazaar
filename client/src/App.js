import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Health from './components/Health';
import Life from './components/Life';
import Travel from './components/Travel';
import Vehicle from './components/Vehicle';
import Policy from './components/Policy';
import ClaimStatus from './components/ClaimStatus';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute exact path="/health" component={Health} />
        <PrivateRoute exact path="/life" component={Life} />
        <PrivateRoute exact path="/travel" component={Travel} />
        <PrivateRoute exact path="/vehicle" component={Vehicle} />
        <PrivateRoute exact path="/policy" component={Policy} />
        <PrivateRoute
          exact
          path="/claim-status"
          component={ClaimStatus}
        />
      </Switch>
    </Router>
  );
}

export default App;
