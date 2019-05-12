import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { Container, Col, Row, Button, Spinner } from 'reactstrap'
// import DashNav from './navigation'
import TaskCreate from './taskCreate';
import TaskList from './taskList';
import MemberList from './memberList';

const layout = {
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};


class EventItem extends Component {
  state = { 
    loading: false,
    sh: {},
    activeTab: 1
  }

  componentDidMount() {
    let ac = this.props.match.params.eventId;
    this.setState({
      loading: true
    });

    this.props.firebase.scavengerHunt(ac).get()
    .then(doc => {
      if(doc.exists) {
        const data = doc.data();
        this.setState({
          sh: data,
          loading: false
        });
      }
    })
  }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }


  toggleTasks = () => {
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

  toggleMembers = () => {
    if (this.state.activeTab !== 3) {
      this.setState({
        activeTab: 3
      });
    }
  }

  render() {
    const { loading, sh, activeTab } = this.state;


    let dueDate = '';

    if(sh.hasOwnProperty('dateEnd')) {
      let dateTS = new Date(sh.dateEnd.seconds*1000);

      const months = {
        0:"January",
        1:"February",
        2:"March",
        3:"April",
        4:"May",
        5:"June",
        6:"July",
        7:"August",
        8:"September",
        9:"October",
        10:"November",
        11:"December"
      }

      let month = months[Number(dateTS.getMonth())]
      let day = dateTS.getDate()
      let year = dateTS.getFullYear()

      dueDate = `${month} ${day}, ${year} at `;

      let hours = dateTS.getHours()
      let minutes = dateTS.getMinutes()

      if (hours > 0 && hours <= 12) {
        dueDate += hours;
      } else if (hours > 12) {
        dueDate += "" + (hours - 12);
      } else if (hours === 0) {
        dueDate += "12";
      }
      dueDate += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
      dueDate += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
    }
    return (
      <Container>
        <Col md="12" lg={{ size: 6}} style={layout}>
          {loading && <Spinner color="danger" />}
          {sh.accessCode && 
            <div>
              <h4>Event: {sh.name}</h4>
              <p><strong>Access Code:</strong> {sh.accessCode}</p>
              <p><strong>Courses:</strong> {sh.courses}</p>
              <p><strong>Description:</strong> {sh.description}</p>            
              <p><strong>Due:</strong> {dueDate}</p>
              <Row style={layout}>
                <Button outline color="danger" onClick={this.toggleTasks} active={activeTab===1} className="mb-3 mx-1 rounded-sm">Task List</Button>
                <Button outline color="danger" onClick={this.toggleCreate} active={activeTab===2} className="mb-3 mx-1 rounded-sm">Create Task</Button>
                <Button outline color="danger" onClick={this.toggleMembers} active={activeTab===3} className="mb-3 mx-1 rounded-sm">Members</Button>
              </Row>
              {activeTab===1 && <TaskList/>}
              {activeTab===2 && <TaskCreate />}
              {activeTab===3 && <MemberList />}                
            </div> 
          }
        </Col>
      </Container>
    )
  }
}
export default withRouter(withFirebase(EventItem));