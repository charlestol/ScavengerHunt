import React from 'react';

import { withAuthorization } from '../Session';
import { SearchScavengerHunt } from '../ScavengerHunt';
import * as ROLES from '../../constants/roles';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>
    <SearchScavengerHunt />
  </div>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.STUDENT;

export default withAuthorization(condition)(HomePage);