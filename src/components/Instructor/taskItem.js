import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

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
            <div className="my-4">
                {task.name}
                <br />
                {task.instructions}
            </div>
        );
    }
}

export default withRouter(withFirebase(TaskItem));