import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import {Spinner} from 'reactstrap';
class TaskItem extends Component {
    state = {
        task: {},
        loading: false
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
                    task: data,
                    loading: false
                });
            }
        });
    }

    render() {
        const {task, loading} = this.state;
        return (
            <div>
                {loading && <Spinner color="danger" />}
                {!loading &&
                    <div>
                        <h4>Task: {task.name}</h4>
                        <p><b>Instructions</b>: {task.instructions}</p>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(withFirebase(TaskItem));