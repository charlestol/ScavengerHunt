import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../authentication/SignUp';
import SignInPage from '../authentication/SignIn';
import PasswordForgetPage from '../authentication/PasswordForget';
import HomePage from '../dashboards/Home';
import AccountPage from '../authentication/Account';
import AdminPage from '../dashboards/Admin';
import {EventItem, TaskItem} from '../ScavengerHunt'
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <hr />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        exact
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.ADMIN} component={AdminPage} />
      <Route exact path={`${ROUTES.ADMIN}/:eventId`} component={EventItem} />
      <Route exact path={`${ROUTES.ADMIN}/:eventId/:taskId`} component={TaskItem} />
    </div>
  </Router>
);

export default withAuthentication(App);