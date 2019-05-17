import React, { Component } from 'react';
import { Spinner } from 'reactstrap'
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

class EventHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      scavengerHunts: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let user = this.props.user;
    this.unsubscribe = this.props.firebase
      .scavengerHunts().where("email", "==", user.email)
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
        <h4>Event History</h4>
        {loading && <Spinner color="danger" />}
        {!loading && scavengerHunts.length===0 && <p>You have not created any scavenger hunt events yet.</p>}
        {scavengerHunts.map(scavengerHunt => (
            <div key={scavengerHunt.accessCode}>
              <Link to={`${URL}/${scavengerHunt.accessCode}`} className="text-danger">
                <h5 className="my-3">{scavengerHunt.name}</h5>
              </Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(EventHistory));