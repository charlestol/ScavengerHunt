import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { Button, Spinner, Alert, Form, FormGroup, Col, Input, Label } from "reactstrap"

const SUCCESS_MSG = 'Student Review Submitted!';
const ERROR_MSG = 'Error submitting Review';

class TotalScore extends Component {
    state = { feedback: '', loading: '', numOfTasks: null, totalScore: null, submitMsg: null }

    componentDidMount() {
        // const { score, feedback } = this.state;
        let self = this;
    
        let ac = this.props.ac;
        let email = this.props.email;
        let totalScore = 0;
        // let task = this.props.task;

        // let data = {
        //     result: {
        //         score,
        //         feedback
        //     }
        // }

        this.props.firebase.scavengerHunt(ac).get()
        .then(doc=> {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            let numOfTasks = doc.data().numOfTasks;
            // console.log(numOfTasks)
            let noneGraded = true;
            let noneGradedMark = '-';
            this.props.firebase.scavengerHuntSubmissions(ac, email).get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.data())
                    let submission = doc.data();
                    if(submission.hasOwnProperty('result')) {
                        console.log(submission.result.score)
                        totalScore += Number(submission.result.score);
                        noneGraded = false;
                    }
                })
                
                if(noneGraded) {
                    totalScore = noneGradedMark;
                }

                this.setState({
                    totalScore,
                    numOfTasks
                })
            })
        })
        .catch(error => {
            // The document probably doesn't exist.
            console.error("Error getting document: ", error);
            self.setState({ 
                submitMsg: ERROR_MSG,
            })
        });
    }

    onSubmit = event => {
        const { totalScore, numOfTasks, feedback } = this.state;
        
        this.setState({ loading: true })

        let ac = this.props.ac;
        let email = this.props.email;

        let data = {
            result: {
                score: `${totalScore}/${numOfTasks}`,
                feedback
            }
        }

        this.props.firebase.scavengerHuntMember(ac, email).update(data)
        .then(() => {
            this.setState({ 
                submitMsg: SUCCESS_MSG,
                feedback: '',
                loading: false
            })
            console.log("Document successfully updated!");
        })
        .catch(error => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            this.setState({ 
                submitMsg: ERROR_MSG,
                loading: false,
            })
        });
    }

    onChange = event => {
        this.setState({ feedback: event.target.value });
    }

    render() {
        const {   
            feedback,
            submitMsg,
            loading,
            totalScore,
            numOfTasks
        } = this.state;

        // const isInvalid = score === '';

        return (
            <div>
                {totalScore === null && numOfTasks === null &&
                    <h4>Total Score: -/-</h4>
                }
                {totalScore !== null && numOfTasks !== null &&
                    <h4>Total Score: {`${totalScore}/${numOfTasks}`}</h4>
                }
                <div>
                    <Form> 
                        <FormGroup>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Label for="Feedback">Event Feedback</Label>
                                <Input
                                    name="textEntry"
                                    id="Feedback"
                                    value={feedback}
                                    onChange={this.onChange}
                                    type="textarea"
                                    placeholder="Type Here"
                                    rows="5"
                                    className="my-2"
                                />
                            </Col>
                            <Button color="danger" onClick={this.onSubmit}>Submit Result</Button>
                        </FormGroup>
                    </Form>
                </div>
                {loading && <Spinner color="danger" />}
                {submitMsg && <Alert color="success">{submitMsg}</Alert>}
            </div>
        );
    }
}

export default withRouter(withFirebase(TotalScore))