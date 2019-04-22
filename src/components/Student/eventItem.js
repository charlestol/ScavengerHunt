import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import ListTasks from './taskList';
import EventResults from './eventResults';
import { AuthUserContext } from '../Session';

class EventItem extends Component {
  state = { 
    loading: false,
    sh: {},
    closed: false
  }

  componentDidMount() {
    let ac = this.props.match.params.eventId;
    this.setState({
      loading: true
    });

    this.props.firebase.scavengerHunt(ac).get()
    .then(doc => {
        const data = doc.data();
        const endDate = data.dateEnd.seconds;
        // converting from millisec to sec to compare to endDate
        const today = (Date.now() / 1000).toFixed(0);
        const closed = data.closed;

        if(today > endDate || closed) {
          this.setState({
            sh: data,
            loading: false,
            closed: true
          });
        } else {
          this.setState({
            sh: data,
            loading: false,
            closed: false
          });
        }
    })
  }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  render() {
    const { loading, sh, closed } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (  
          <div>
            {loading && <div>Loading ...</div>}
            {sh.accessCode && 
              <div>
                {sh.name}
                {closed && 
                  <p>This event has ended</p>
                }
                <EventResults email={authUser.email} />
                <ListTasks email={authUser.email} />
              </div>
            }
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}
export default withRouter(withFirebase(EventItem));