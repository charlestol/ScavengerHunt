import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';

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
          scavengerHunts.push({ ...doc.data() })
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
    return (
      <div>
        <h2>Scavenger Hunt Events</h2>
        {loading && <div>Loading ...</div>}
        {scavengerHunts.map(scavengerHunt => (
            <div key={scavengerHunt.accessCode}>
              <Link 
                to={`${this.props.match.url}/${scavengerHunt.name}`} 
              >
                {scavengerHunt.name}
              </Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withFirebase(EventList);