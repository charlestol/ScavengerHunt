import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import SearchEvent from './eventSearch';
import ActiveEvents from './eventsActive';
import EventHistory from './eventHistory';
import * as ROLES from '../../constants/roles';

const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <SearchEvent />
        <ActiveEvents email={authUser.email} />
        <EventHistory email={authUser.email} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.STUDENT;

export default withAuthorization(condition)(HomePage);
