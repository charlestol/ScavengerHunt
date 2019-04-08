import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import Submit from './submit';

class TaskItem extends Component {
    state = {
        task: {}
    }
    componentDidMount() {
        let name = this.props.match.params.taskId;
        let ac = this.props.match.params.eventId;
        this.setState({
            loading: true
        });
    
        this.props.firebase.scavengerHuntTask(ac, name).get()
        .then(doc => {
            if(doc.exists) {
                const data = doc.data();
                this.setState({
                    task: data
                });
            }
        });
    }

    render() {
        const {task} = this.state;
        return (
            <div>
                <h3>Task: {task.name}</h3>
                <br />
                <p>instructions: {task.instructions}</p>
                <br />
                <div>Submission Type: {task.entryType}</div>
                <br />
                <Submit task={task} />
            </div>
        );
    }
}

export default withRouter(withFirebase(TaskItem));