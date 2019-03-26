import React from 'react';

import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import { CreateScavengerHunt } from '../ScavengerHunt';

const AdminPage = () => (
      <div>
        <CreateScavengerHunt />
      </div>
);

const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default withAuthorization(condition)(AdminPage);