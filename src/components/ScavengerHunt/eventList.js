import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      scavengerHunts: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .scavengerHunts().where("email", "==", this.props.email)
      .onSnapshot(snapshot => {
        let scavengerHunts = [];

        snapshot.forEach(doc => {
          let data = doc.data();
          scavengerHunts.push(data);
        });

        this.setState({
          scavengerHunts,
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { scavengerHunts, loading } = this.state;
    const URL = this.props.match.url;
    return (
      <div>
        <h2>Scavenger Hunt Events</h2>
        {loading && <div>Loading ...</div>}
        {scavengerHunts.map(scavengerHunt => (
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

export default withRouter(withFirebase(EventList));