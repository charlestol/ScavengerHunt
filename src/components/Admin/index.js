import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import { CreateScavengerHunt, ListScavengerHunts } from '../ScavengerHunt';

const AdminPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <CreateScavengerHunt />
        <ListScavengerHunts email={authUser.email} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(condition)(AdminPage);