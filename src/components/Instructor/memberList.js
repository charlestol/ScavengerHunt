import React, { Component } from 'react';
import { Spinner } from 'reactstrap'
import { withFirebase } from '../Firebase';
import { withRouter, Link } from 'react-router-dom';

class EventMembers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      members: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let ac = this.props.match.params.eventId;

    this.props.firebase.scavengerHuntMembers(ac)
    .onSnapshot(querySnapshot => {
        let members = [];
        querySnapshot.forEach(doc => {
            let data = doc.data();
            members.push(data);
        });

        this.setState({
          members,
          loading: false,
        });
      });
  }

  render() {
    const { members, loading } = this.state;
    // console.log('list', tasks)
    const URL = this.props.match.url;
    console.log(URL)
    return (
      <div>
        <h4>Members</h4>
        {loading && <Spinner color="danger" />}
        {!loading && members.length===0 && <p>No participants have joined this event yet.</p>}
        {members.map(member => (
            <div key={member.email}>
                <Link to={`${URL}/member/${member.email}`} className="text-danger"><h5 className="my-3">{member.name}</h5></Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(EventMembers));