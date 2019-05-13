import React, {Component} from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import CreateEvent from './eventCreate';
import EventHistory from './eventHistory';
import ActiveEvents from './eventsActive';
import { Container, Col, Row, Button } from 'reactstrap'

const layout = {
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};

class AdminPage extends Component {
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

  toggleCreate = () => {
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
            <Col md="12" lg={{ size: 6}} style={layout}>
              <h4 className="mb-3">Dashboard</h4>
               <Row style={layout}>
                 <Button outline color="danger" onClick={this.toggleActive} active={activeTab===1} className="mb-3 mx-1 rounded-sm">Active Events</Button>
                 <Button outline color="danger" onClick={this.toggleCreate} active={activeTab===2} className="mb-3 mx-1 rounded-sm">Create Event</Button>
                 <Button outline color="danger" onClick={this.toggleHistory} active={activeTab===3} className="mb-3 mx-1 rounded-sm">Event History</Button>
               </Row>
               {activeTab===1 && <ActiveEvents user={authUser} />}
               {activeTab===2 && <CreateEvent />}
               {activeTab===3 && <EventHistory user={authUser} />}
            </Col>
          </Container>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const condition = authUser =>
  authUser && authUser.role===ROLES.INSTRUCTOR;

export default withAuthorization(condition)(AdminPage);