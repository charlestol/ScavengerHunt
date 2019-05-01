import React, {Component} from 'react';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { Button, Spinner, Form, FormGroup, Label, Alert } from "reactstrap"

const INITIAL_STATE = {
    score: '',
    feedback: '',
    loading: false
}

const SUCCESS_MSG = 'Task Reviewed Submitted!';
const ERROR_MSG = 'Error submitting Review';

class GiveScore extends Component {
    state = { ...INITIAL_STATE, submitMsg: null }

    onSubmit = event => {
        const { score, feedback } = this.state;
        let self = this;
        
        this.setState({ loading: true })
        let ac = this.props.ac;
        let email = this.props.email;
        let task = this.props.task;

        let data = {
            result: {
                score,
                feedback
            }
        }
        this.props.firebase.scavengerHuntSubmission(ac, email, task).update(data)
        .then(() => {
            self.setState({ 
                submitMsg: SUCCESS_MSG,
                ...INITIAL_STATE
            })
            console.log("Document successfully updated!");
        })
        .catch(error => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            self.setState({ 
                submitMsg: ERROR_MSG,
                loading: false,
            })
        });

        event.preventDefault();
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const {   
            score,
            feedback,
            submitMsg,
            loading 
        } = this.state;

        const isInvalid = score === '';

        return (
            <div className="my-4">
                <Form onSubmit={this.onSubmit}>
                    <div>
                        <label>
                            <input
                                name="score"
                                value={1}
                                checked={score === '1'}
                                onChange={this.onChange}
                                type="radio"
                            />
                            Correct
                        </label>
                        <label>
                            <input
                                name="score"
                                value={0}
                                checked={score === '0'}
                                onChange={this.onChange}
                                type="radio"
                            />
                            Incorrect
                        </label>
                    </div>
                    <label>
                        Feedback
                        <br />
                        <input 
                            name="feedback"
                            value={feedback}
                            onChange={this.onChange}
                            type="text"
                            placeholder="Type feedback here"
                        />
                    </label>
                    <br />
                    <Button color="danger" disabled={isInvalid} type="submit">
                        Submit
                    </Button>
                    {loading && <Spinner color="danger" />}
                    {submitMsg && <Alert color="success">{submitMsg}</Alert>}
                </Form>
            </div>
        );
    }
}

export default withRouter(withFirebase(GiveScore))