import React, { Component } from 'react';

// import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

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
    const URL = this.props.match.url;

    return (
      <div>
        <h2>Event History</h2>
        {loading && <div>Loading ...</div>}
        {scavengerHunts.map(scavengerHunt => (
            <div key={scavengerHunt.accessCode}>
              <Link to={`${URL}/${scavengerHunt.accessCode}`}>
                  <strong>{scavengerHunt.name}</strong>
              </Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(ScavengerHuntHistory));
