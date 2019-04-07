import React from 'react';

import { AuthUserContext, withAuthorization } from '../../Session';
import { SearchEvent, EventHistory } from '../../ScavengerHunt';
import * as ROLES from '../../../constants/roles';

const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <SearchEvent />
        <EventHistory email={authUser.email} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.STUDENT;

export default withAuthorization(condition)(HomePage);
