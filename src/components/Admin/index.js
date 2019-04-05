import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import { CreateScavengerHunt, EventList } from '../ScavengerHunt';
import { Route } from 'react-router-dom';
import EventItem from '../ScavengerHunt/eventItem';

const AdminPage = ({match}) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <Route
          exact path={match.path}
          render={() => 
            <div>
              <CreateScavengerHunt />
              <EventList email={authUser.email} match={match} />
            </div>
          }
        />
        <Route exact path={`${match.path}/:topicId`} component={EventItem} />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.INSTRUCTOR;

export default withAuthorization(condition)(AdminPage);