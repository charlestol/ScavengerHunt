import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import ListTasks from './taskList';
import { AuthUserContext } from '../Session';

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
      <AuthUserContext.Consumer>
      {authUser => (
        <div>
          {loading && <div>Loading ...</div>}
          {sh.accessCode && 
            <div>
              {sh.name}
              <ListTasks email={authUser.email}/>
            </div>
          }
        </div>
      )}
      </AuthUserContext.Consumer>
    )
  }
}
export default withRouter(withFirebase(EventItem));