import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

class eventMembers extends Component {
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

    return (
      <div>
        <h2>Members</h2>
        {loading && <div>Loading ...</div>}
        {members.map(member => (
            <div key={member.email}>
                {/* <Link to={`${URL}/${member.name}`}>{member.name}</Link> */}
                {member.name}
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(eventMembers));