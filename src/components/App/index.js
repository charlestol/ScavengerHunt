import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import Landing from '../Landing';
import {SignUp, SignIn, PasswordForget, Account} from '../Authentication';
import {StudentEventItem, StudentTaskItem, StudentDash} from '../Student';
import {InstructorEventItem, InstructorTaskItem, InstructorDash} from '../Instructor'
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <hr />
      <Route exact path={ROUTES.LANDING} component={Landing} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
      <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
      <Route
        exact
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForget}
      />
      <Route exact path={ROUTES.HOME} component={StudentDash} />
      <Route exact path={`${ROUTES.HOME}/:eventId`} component={StudentEventItem} />
      <Route exact path={`${ROUTES.HOME}/:eventId/:taskId`} component={StudentTaskItem} />
      <Route exact path={ROUTES.ACCOUNT} component={Account} />
      <Route exact path={ROUTES.ADMIN} component={InstructorDash} />
      <Route exact path={`${ROUTES.ADMIN}/:eventId`} component={InstructorEventItem} />
      <Route exact path={`${ROUTES.ADMIN}/:eventId/:taskId`} component={InstructorTaskItem} />
    </div>
  </Router>
);

export default withAuthentication(App);