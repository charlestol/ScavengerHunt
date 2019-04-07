import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import ListTasks from './taskList';

const INITIAL_STATE = {
    name: '',
    instructions: '',
    entryType: '',
    error: null
}

class CreateTask extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
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

        const accessCode = this.props.accessCode;

        this.props.firebase.scavengerHuntTask(accessCode,name).set(taskData)
            .then(() => {
                console.log("Document successfully written!");
                this.setState({ ...INITIAL_STATE });
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
                this.setState({error})
            });

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
            error
        } = this.state;

        const isInvalid = 
            name === '' ||
            instructions === '' ||
            entryType === '';

        return (
                    <div>
                        <form onSubmit={this.onCreateTask}>
                            <input
                                name="name"
                                value={name}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Task Name"
                            />
                            <br />
                            <input
                                name="instructions"
                                value={instructions}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Task Instructions"
                            />
                            <br />
                            <div>
                                <label>
                                    <input
                                        name="entryType"
                                        value="Image"
                                        checked={entryType === "Image"}
                                        onChange={this.onChange}
                                        type="radio"
                                    />
                                    Image
                                </label>
                                <label>
                                    <input
                                        name="entryType"
                                        value="Text"
                                        checked={entryType === "Text"}
                                        onChange={this.onChange}
                                        type="radio"
                                    />
                                    Text
                                </label>
                            </div>
                            <button disabled={isInvalid} type="submit">
                                Add Task
                            </button>
                            <br />
                            {error && <p>{error}</p>}
                            <ListTasks accessCode={this.props.accessCode} />
                        </form>
                    </div>
        );
    }
}

export default withFirebase(CreateTask)

