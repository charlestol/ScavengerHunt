import React from 'react';
import { Container, Col, Row } from 'reactstrap'
import { AuthUserContext, withAuthorization } from '../Session';
import SearchEvent from './eventSearch';
import ActiveEvents from './eventsActive';
import EventHistory from './eventHistory';
import * as ROLES from '../../constants/roles';

const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Container>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <SearchEvent />
          <ActiveEvents email={authUser.email} />
          <EventHistory email={authUser.email} />
        </Col>
      </Container>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser =>
  authUser && authUser.role===ROLES.STUDENT;

export default withAuthorization(condition)(HomePage);
