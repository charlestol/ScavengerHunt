import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
// import CreateTask from './createTask';
// import ListTasks from './taskList';
// import EventMembers from './eventMembers';
import DashNav from './navigation'

class EventItem extends Component {
  state = { 
    loading: false,
    sh: {}
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

  render() {
    const { loading, sh } = this.state;
    return (
      <div>
        {loading && <div>Loading ...</div>}
        {sh.accessCode && 
          <div>
            {sh.name}
            <DashNav />
          </div>
        }
      </div>
    )
  }
}
export default withRouter(withFirebase(EventItem));