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
                    <h4>{memberInfo.name}</h4>
                    <h5>{memberInfo.email}</h5>
                    <TotalScore ac={ac} email={email} />
                    <MemTaskList />
                </div>
                }
            </div>
        )
    }
}

export default withFirebase(MemberInfo)