import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

class CompletionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      tasks: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let ac = this.props.match.params.eventId;
    let email = this.props.match.params.memberId;

    console.log(ac)

    this.unsubscribe = this.props.firebase.scavengerHuntTasks(ac)
    .onSnapshot(querySnapshot => {
        let tasks = [];
        querySnapshot.forEach(doc => {
            let task = doc.data();

            this.props.firebase.scavengerHuntSubmission(ac, task.name, email).get()
            .then(doc => {
                
                if(doc.exists) {
                    task.submitted = true;
                    tasks.push(task);
                    this.setState({
                        tasks,
                        loading: false,
                    });
                } else {
                    task.submitted = false;
                    tasks.push(task);
                    this.setState({
                        tasks,
                        loading: false,
                    });
                }
            });
        });
      });
  }

  componentWillUnmount() {
      this.unsubscribe();
  }

  render() {
    const { tasks, loading } = this.state;
    console.log('list', tasks)
    // const URL = this.props.match.url;

    return (
      <div>
        <h2>Tasks</h2>
        {loading && <div>Loading ...</div>}
        {tasks.map(task => (
            <div key={task.name}>
                <div>{task.name} {task.submitted ? <span>&#10004;</span> : <span>&#10008;</span> }</div>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(CompletionList));