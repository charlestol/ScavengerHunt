import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import Submit from './submit';
import TaskResult from './taskResult';

class TaskItem extends Component {
    state = {
        task: {}
    }
    componentDidMount() {
        let task = this.props.match.params.taskId;
        let ac = this.props.match.params.eventId;
        this.setState({
            loading: true
        });
    
        this.props.firebase.scavengerHuntTask(ac, task).get()
        .then(doc => {
            const data = doc.data();
            this.setState({
                task: data
            });
        });
    }

    render() {
        const {task} = this.state;
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        <h3>Task: {task.name}</h3>
                        <p>instructions: {task.instructions}</p>
                        <br />
                        <div>Submission Type: {task.entryType}</div>
                        <br />
                        <Submit task={task} />
                        <TaskResult email={authUser.email} />
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withRouter(withFirebase(TaskItem));