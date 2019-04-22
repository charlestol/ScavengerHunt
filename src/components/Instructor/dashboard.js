import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import CreateEvent from './eventCreate';
import EventHistory from './eventHistory';
import ActiveEvents from './eventsActive';

const AdminPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <CreateEvent />
        <ActiveEvents user={authUser} />
        <EventHistory user={authUser} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.INSTRUCTOR;

export default withAuthorization(condition)(AdminPage);