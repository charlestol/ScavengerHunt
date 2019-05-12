import React, { Component } from 'react';
import { Button, Alert, Form, Input } from "reactstrap"
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
const INITIAL_STATE = {
    name: '',
    instructions: '',
    entryType: '',
    error: null,
}

const SUCCESS_CREATE = "Task successfully added!";
const ERROR_TASK_EXISTS = "A task with this name already exists. Please try a different name."

class CreateTask extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE, msg: null};
    }

    onCreateTask = event => {
        const {
            name,
            instructions,
            entryType,
        } = this.state;        
        
        let taskData = {
            name,
            instructions,
            entryType,
        };

        const accessCode = this.props.match.params.eventId;
        this.props.firebase.scavengerHuntTask(accessCode,name).get()
        .then(doc => {
            if(doc.exists) {
                this.setState({error: ERROR_TASK_EXISTS})
            } else {
                this.props.firebase.scavengerHuntTask(accessCode,name).set(taskData)
                .then(() => {
                    this.props.firebase.scavengerHunt(accessCode).update({
                        numOfTasks: this.props.firebase.fieldValue.increment(1)
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        this.setState({ ...INITIAL_STATE, msg: SUCCESS_CREATE });
                    })
                    .catch(error => {
                        console.error("Error writing document: ", error);
                        this.setState({error})
                    });
                })
                .catch(error => {
                    console.error("Error writing document: ", error);
                    this.setState({error})
                });
            }
        })
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            name,
            instructions,
            entryType,
            error,
            msg
        } = this.state;

        const isInvalid = 
            name === '' ||
            instructions === '' ||
            entryType === '';

        return (
            <div>
                <Form onSubmit={this.onCreateTask}>
                    <h4>Create a Task!</h4>
                    <Input
                        name="name"
                        value={name}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Task Name"
                        className="mb-3 rounded-sm"
                    />
                    <Input
                        name="instructions"
                        value={instructions}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Task Instructions"
                        className="mb-3 rounded-sm"
                    />
                    <div>
                        <p><strong>Select the submission type:</strong></p>
                        <label className="mx-2">
                            <input
                                name="entryType"
                                value="image"
                                checked={entryType === "image"}
                                onChange={this.onChange}
                                type="radio"
                                className="mb-3 rounded-sm"
                            />
                            Image
                        </label>
                        <label className="mx-2">
                            <input
                                name="entryType"
                                value="text"
                                checked={entryType === "text"}
                                onChange={this.onChange}
                                type="radio"
                                className="mb-3 rounded-sm"
                            />
                            Text
                        </label>
                    </div>
                    <Button color="danger" disabled={isInvalid} type="submit" className="mb-3 rounded-sm">
                        Add Task
                    </Button>
                    {msg && <Alert color="success">{msg}</Alert>}
                    {error && <Alert color="danger">{error}</Alert>}
                </Form>
            </div>
        );
    }
}

export default withRouter(withFirebase(CreateTask));

