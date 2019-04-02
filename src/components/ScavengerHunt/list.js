import React, { Component } from 'react';

// import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import ScavengerHuntEvent from './eventItem';

class ListScavengerHunts extends Component {
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
        <ul>
        {scavengerHunts.map(scavengerHunt => (
            <div key={scavengerHunt.accessCode}>
              <ScavengerHuntEvent sh={scavengerHunt} />
            </div>
        ))}
        </ul>
      </div>
    );
  }
}

export default withFirebase(ListScavengerHunts);