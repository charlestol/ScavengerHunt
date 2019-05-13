import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import MemTaskList from './memberTaskList';
import TotalScore from './scoreTotal';

class MemberInfo extends Component {
    state = { memberInfo: null }
    componentDidMount() {
        // this.setState({ loading: true })
        let ac = this.props.match.params.eventId;
        let email = this.props.match.params.memberId
        this.props.firebase.scavengerHuntMember(ac, email).get()
        .then(doc => {
            const memberInfo = doc.data();
            // console.log(memberInfo)
            this.setState({ memberInfo })
        })
    }
    render() {
        const { memberInfo } = this.state;

        let ac = this.props.match.params.eventId;
        let email = this.props.match.params.memberId;

        return (
            <div>
                {memberInfo &&
                <div>
                    <h4>Student Name: {memberInfo.name}</h4>
                    <h4>Student Email: {memberInfo.email}</h4>
                    <hr />
                    <TotalScore ac={ac} email={email} />
                    <br />
                    <MemTaskList />
                </div>
                }
            </div>
        )
    }
}

export default withFirebase(MemberInfo)