import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { SearchScavengerHunt, HistoryScavengerHunt } from '../ScavengerHunt';
import * as ROLES from '../../constants/roles';

const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        <SearchScavengerHunt />
        <HistoryScavengerHunt email={authUser.email} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.STUDENT;

export default withAuthorization(condition)(HomePage);
