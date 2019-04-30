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
