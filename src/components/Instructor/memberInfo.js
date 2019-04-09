import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import CompletionList from './completionList';

class MemberInfo extends Component {
    state = { memberInfo: null }
    componentDidMount() {
        // this.setState({ loading: true })
        let ac = this.props.match.params.eventId;
        let email = this.props.match.params.memberId
        this.props.firebase.scavengerHuntMember(ac, email).get()
        .then(doc => {
            const memberInfo = doc.data();
            console.log(memberInfo)
            this.setState({ memberInfo })
        })
    }
    render() {
        const { memberInfo } = this.state;
        return (
            <div>
                {memberInfo &&
                <div>
                    <h4>{memberInfo.name}</h4>
                    <h5>{memberInfo.email}</h5>
                    <CompletionList />
                </div>
                }
            </div>
        )
    }
}

export default withFirebase(MemberInfo)