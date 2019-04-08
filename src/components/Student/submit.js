import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { AuthUserContext } from '../Session';

const SUCCESS_MSG = "Submitted!";
const ERROR_MSG = "Error, try submitting again.";
// const ERROR_MSG = "This scavenger hunt event is closed. Contact the instructor for more information."

class Submit extends Component {
   state = { message: null, textEntry: '', image: null, imageURL: '', progress: 0 }

    onSubmitText = (user) => {
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

    onSubmitImage = (user) => {
        const self = this;
        const { image } = this.state;
        let accessCode = this.props.match.params.eventId;
        let name = this.props.task.name;

        const uploadTask = this.props.firebase.store.ref(`images/${image.name}`).put(image);
        uploadTask.on('state_changed', 
        snapshot => {
            // progress func
            const progress = Math.round(( snapshot.bytesTransferred / snapshot.totalBytes ) * 100)
            this.setState({progress})
        }, 
        error => {
            // error func
            console.log(error);
        }, 
        () => {
            // complete func
            this.props.firebase.store.ref('images').child(image.name).getDownloadURL()
            .then(imageURL => {
                console.log(imageURL)
                self.setState({ imageURL })

                const submitData = {
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    studentID: user.studentID,
                    imageURL,
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
            })
        });
    }

    onChangeText = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeImage = event => {
        if(event.target.files[0]) {
            const image = event.target.files[0]
            this.setState({ image })
            console.log(image);
        }
    }

    render() {
        const {
            message, textEntry, image, progress, imageURL
        } = this.state;

        const noImage = image === null;
        const noText = textEntry === '';

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {this.props.task.entryType==="text" &&
                            <div> 
                                <input
                                    name="textEntry"
                                    value={textEntry}
                                    onChange={this.onChangeText}
                                    type="text"
                                    placeholder="Type Here"
                                />
                                <br />
                                <button disabled={noText} onClick={() => this.onSubmitText(authUser)}>
                                    Submit
                                </button>
                            </div>
                        }
                        {this.props.task.entryType==="image" &&
                            <div> 
                                <progress value={progress} max="100" />
                                <input
                                    onChange={this.onChangeImage}
                                    type="file"
                                />
                                <br />
                                <button disabled={noImage} onClick={() => this.onSubmitImage(authUser)}>
                                    Submit
                                </button>
                                <br />
                                {/* Preview the image that was just uploaded */}
                                <img src={imageURL} alt="Uploaded Images" height="300" width="400" />
                            </div>
                        }
                        {message && <div>{message}</div>}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withRouter(withFirebase(Submit));
