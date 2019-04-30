import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

class ActiveEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      activeEvents: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let user = this.props.user;
    // converting from millisec to sec to compare to endDate

    // console.log(today)

    this.props.firebase
      .scavengerHunts().where("email", "==", user.email)
      .onSnapshot(snapshot => {
        let activeEvents = [];

        snapshot.forEach(doc => {
          let data = doc.data();
          const closed = data.closed;
          const endDate = data.dateEnd.seconds;
          // convert millisec to sec
          const today = (Date.now() / 1000).toFixed(0);

          if(today < endDate && !closed) {
            activeEvents.push(data);
          }
        });

        this.setState({
          activeEvents,
          loading: false,
        });
      });
  }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  render() {
    const { activeEvents, loading } = this.state;
    const URL = this.props.match.url;
    return (
      <div>
        <h2>On-Going Hunt Events</h2>
        {loading && <div>Loading ...</div>}
        {activeEvents.map(scavengerHunt => (
            <div key={scavengerHunt.accessCode}>
              <Link to={`${URL}/${scavengerHunt.accessCode}`}>
                {scavengerHunt.name}
              </Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(ActiveEvents));