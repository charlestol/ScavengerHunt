import React, { Component } from 'react';
import { Button } from "reactstrap"

import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
// ADDING START DATE AND END DATE LATER

const INITIAL_STATE = {
    loading: false,
    message: null
}

const SUCCESS_MSG = "You're in. Enjoy your hunt!"
// const ERROR_MSG = "This scavenger hunt event is closed. Contact the instructor for more information."

class JoinScavengerHunt extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onJoin = (user) => {
      let self = this;
        const userData = {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            studentID: user.studentID,
            graded: false,
        }
        console.log(user)
        this.setState({ loading: true })
        this.props.firebase.scavengerHuntMember(this.props.scavengerHunt.accessCode, user.email).set(userData)
        .then(() => {

            self.props.firebase.addToUserHistory(user.email, this.props.scavengerHunt.accessCode).set(self.props.scavengerHunt)
            .then(() => {
            console.log("User Successfully joined!");
            self.setState({
                loading: false,
                message: SUCCESS_MSG
            });
            })
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
            this.setState({
                error
            })
        });
    }

    render() {
        const {
            message
        } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {authUser &&
                        <Button color="danger" onClick={() => this.onJoin(authUser)}>
                            Join
                        </Button>
                        }
                        {message && <div>{message}</div>}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(JoinScavengerHunt)
