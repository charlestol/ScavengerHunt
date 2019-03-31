import React, { Component } from 'react';

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
        console.log(user)
        this.setState({ loading: true })        
        this.props.firebase.joinScavengerHunt(this.props.accessCode, user.studentID).set(user)
            .then(() => {
                console.log("User Successfully joined!");
                this.setState({ 
                    loading: false, 
                    message: SUCCESS_MSG
                });
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
                        <button onClick={() => this.onJoin(authUser)}>
                            Join
                        </button>
                        {message && <div>{message}</div>}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(JoinScavengerHunt)

