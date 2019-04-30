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
    let email = this.props.email;
    // converting from millisec to sec to compare to endDate
    const today = new Date();

    // console.log(today)

    this.props.firebase
      .userHistory(email).where("dateEnd", ">", today)
      .onSnapshot(snapshot => {
        let activeEvents = [];

        snapshot.forEach(doc => {
          let data = doc.data();
          const closed = data.closed;
          // console.log(data.dateEnd)
          if(!closed) {
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
        <h4>On-Going Hunt Events</h4>
        {loading && <div>Loading ...</div>}
        {activeEvents.map(scavengerHunt => (
            <div key={scavengerHunt.accessCode}>
              <Link to={`${URL}/${scavengerHunt.accessCode}`} className="text-danger">
                {scavengerHunt.name}
              </Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(ActiveEvents));