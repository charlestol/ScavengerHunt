import React, {Component} from 'react';
import { Container, Col, Row, Button } from 'reactstrap'
import { AuthUserContext, withAuthorization } from '../Session';
import SearchEvent from './eventSearch';
import ActiveEvents from './eventsActive';
import EventHistory from './eventHistory';
import * as ROLES from '../../constants/roles';

const layout = {
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};

class HomePage extends Component {
  state = {
    activeTab: 1
  }

  toggleActive = () => {
    if (this.state.activeTab !== 1) {
      this.setState({
        activeTab: 1
      });
    }
  }

  toggleJoin = () => {
    if (this.state.activeTab !== 2) {
      this.setState({
        activeTab: 2
      });
    }
  }

  toggleHistory = () => {
    if (this.state.activeTab !== 3) {
      this.setState({
        activeTab: 3
      });
    }
  }

  render() {
    const { activeTab } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Container>
            <Col sm="12" md={{ size: 8}} style={layout}>
                <Row style={layout}>
                  <Button outline color="danger" onClick={this.toggleActive} active={activeTab===1} className="mb-3 mx-1 rounded-sm">Active Events</Button>
                  <Button outline color="danger" onClick={this.toggleJoin} active={activeTab===2} className="mb-3 mx-1 rounded-sm">Join Event</Button>
                  <Button outline color="danger" onClick={this.toggleHistory} active={activeTab===3} className="mb-3 mx-1 rounded-sm">Event History</Button>
                </Row>
                {activeTab===1 && <ActiveEvents email={authUser.email} />}
                {activeTab===2 && <SearchEvent />}
                {activeTab===3 && <EventHistory email={authUser.email} />}
            </Col>
          </Container>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser =>
  authUser && authUser.role===ROLES.STUDENT;

export default withAuthorization(condition)(HomePage);
