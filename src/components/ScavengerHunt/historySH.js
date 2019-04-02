import React, { Component } from 'react';

// import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

class ScavengerHuntHistory extends Component {
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
      .userHistory(this.props.email)
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
        <ul>
        {scavengerHunts.map(scavengerHunt => (
            <li key={scavengerHunt.accessCode}>
              <span>
                  <strong>{scavengerHunt.name}</strong>
              </span>
            </li>
        ))}
        </ul>
      </div>
    );
  }
}

export default withFirebase(ScavengerHuntHistory);
