import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { AuthUserContext } from '../Session';
import ViewSubmission from './viewSubmission';

const SUCCESS_MSG = "Submitted!";
const ERROR_MSG = "Error, try submitting again.";
// const ERROR_MSG = "This scavenger hunt event is closed. Contact the instructor for more information."

class Submit extends Component {
    // Initial state
   state = { 
       message: null, 
       textEntry: '', 
       image: null, 
       imageURL: '', 
       progress: 0, 
       submitted: false,
       closed: false 
    }

    componentDidMount() {
        let accessCode = this.props.match.params.eventId;

        // on componentDidMount, if the event has ended, close submissions by no rendering the submission elements
        this.props.firebase.scavengerHunt(accessCode).get()
        .then(doc => {
            // console.log("Document data:", doc.data());
            const sh = doc.data();
            const closed = sh.closed;
            const endDate = sh.dateEnd.seconds;
            const today = (Date.now() / 1000).toFixed(0);

            if(today > endDate || closed) {
                this.setState({
                    closed: true,
                })
            } else {
                this.setState({
                    closed: false,
                })
            }
        }).catch(error => {
            this.setState({
                error: error,
                loading: false,
                scavengerHunt: null
            })
            console.log("Error getting document:", error);
        });

    }

    onSubmitText = (user) => {
        // array destructuring so state exists in this function
        const { textEntry } = this.state;
        // grabbing the access code from the route
        let accessCode = this.props.match.params.eventId;
        // getting the task information from the task parent
        let task = this.props.task.name;

        // Data to be saved to the database
        const submitData = {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            studentID: user.studentID,
            textEntry,
            taskName: task,
        }
        // save data in a task's submission collection
        this.props.firebase.scavengerHuntSubmission(accessCode, user.email, task).set(submitData)
        .then(() => {
            console.log("Submission Successful!");
            this.setState({
                message: SUCCESS_MSG,
                submitted: true
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
        // array destructuring so state exists in this function
        const { image } = this.state;
        // grabbing the access code from the route
        let accessCode = this.props.match.params.eventId;
        // getting the task information from the task parent
        let task = this.props.task.name;

        // prepare image to be store to this storage path
        const uploadTask = this.props.firebase.store.ref(`${accessCode}/${task}/${image.name}`).put(image);
        // perform image upload
        uploadTask.on('state_changed', 
        snapshot => {
            // progress function
            const progress = Math.round(( snapshot.bytesTransferred / snapshot.totalBytes ) * 100)
            this.setState({ progress })
        }, 
        error => {
            // error function
            console.log(error);
        }, 
        () => {
            // complete function
            // get the URL of where the image is stored, will be used for viewing when doing <img src={url} />
            this.props.firebase.store.ref(`${accessCode}/${task}`).child(image.name).getDownloadURL()
            .then(imageURL => {
                console.log(imageURL)
                this.setState({ imageURL })
                // Data to be saved to the database
                const submitData = {
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    studentID: user.studentID,
                    imageURL,
                    taskName: task,
                }
                // save data in a task's submission collection
                this.props.firebase.scavengerHuntSubmission(accessCode, user.email, task).set(submitData)
                .then(() => {
                    console.log("Submission Successful!");
                    this.setState({
                        message: SUCCESS_MSG,
                        submitted: true
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
            message, textEntry, image, progress, imageURL, submitted, closed
        } = this.state;

        const noImage = image === null;
        const noText = textEntry === '';

        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {this.props.task.entryType==="text" && !closed &&
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
                                <br />
                                {message && <div>{message}</div>}
                                <br />
                                {submitted && 
                                    <div>
                                        <h5>Submitted Text: </h5>
                                        <p>{textEntry}</p>
                                    </div>    
                                }
                            </div>
                        }
                        {this.props.task.entryType==="image" && !closed &&
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
                                {message && <div>{message}</div>}
                                <br />
                                {/* Preview the image that was just uploaded */}
                                {submitted && <img src={imageURL} alt="Uploaded Images" height="300" width="400" />}
                            </div>
                        }
                        <ViewSubmission email={authUser.email} />
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withRouter(withFirebase(Submit));
