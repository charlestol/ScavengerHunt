import React from 'react';

import { AuthUserContext, withAuthorization } from '../../Session';
import * as ROLES from '../../../constants/roles';
import { CreateEvent, EventList } from '../../ScavengerHunt';

const AdminPage = ({match}) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <CreateEvent />
        <EventList email={authUser.email} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.INSTRUCTOR;

export default withAuthorization(condition)(AdminPage);