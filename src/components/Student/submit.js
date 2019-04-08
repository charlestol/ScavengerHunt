import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { AuthUserContext } from '../Session';

const SUCCESS_MSG = "Submitted!";
const ERROR_MSG = "Error, try submitting again.";
// const ERROR_MSG = "This scavenger hunt event is closed. Contact the instructor for more information."

class Submit extends Component {
   state = { message: null, textEntry: '', image: null }

    onSubmit = (user) => {
        const {textEntry} = this.state;
        let accessCode = this.props.match.params.eventId;
        let name = this.props.task.name;
        const submitData = {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            studentID: user.studentID,
            textEntry,
        }

        this.props.firebase.scavengerHuntSubmission(accessCode, name, user.email).set(submitData)
        .then(() => {
            console.log("Submission Successful!");
            this.setState({
                message: SUCCESS_MSG
            });
            })
        .catch(function(error) {
            console.error("Error writing document: ", error);
            this.setState({
                message: ERROR_MSG                
            })
        });
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            message, textEntry
        } = this.state;

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {this.props.task.entryType==="text" && 
                          <input
                            name="textEntry"
                            value={textEntry}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Type Here"
                          />
                        }
                        <br />
                        <button onClick={() => this.onSubmit(authUser)}>
                            Submit
                        </button>
                        
                        {message && <div>{message}</div>}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withRouter(withFirebase(Submit));
