import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import { CreateScavengerHunt, EventList } from '../ScavengerHunt';

const AdminPage = ({match}) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <CreateScavengerHunt />
        <EventList email={authUser.email} match={match} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.INSTRUCTOR;

export default withAuthorization(condition)(AdminPage);