import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import CreateEvent from './createEvent';
import EventList from './eventList';

const AdminPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <CreateEvent />
        <EventList user={authUser} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.INSTRUCTOR;

export default withAuthorization(condition)(AdminPage);