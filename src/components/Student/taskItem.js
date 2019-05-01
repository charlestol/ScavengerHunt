import React, {Component} from 'react';
import { Container, Col } from 'reactstrap'
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
                    <Container>
                        <h4>Task: {task.name}</h4>
                        <p>instructions: {task.instructions}</p>
                        <div>Submission Type: {task.entryType}</div>
                        <Submit task={task} />
                        <TaskResult email={authUser.email} />
                    </Container>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withRouter(withFirebase(TaskItem));