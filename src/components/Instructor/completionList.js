import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

class CompletionList extends Component {
  state = {
    loading: false,
    tasksCompleted: [],
    tasksInProgess: [],
  }

  componentDidMount() {
    this.setState({ loading: true });
    let ac = this.props.match.params.eventId;
    let email = this.props.match.params.memberId;

    // console.log(ac)

    this.props.firebase.scavengerHuntSubmissions(ac, email)
    .onSnapshot(querySnapshot => {
      let tasksCompleted = [];
      let tasksInProgess = [];

      querySnapshot.forEach(doc => {
          let submission = doc.data();
          tasksCompleted.push(submission.taskName);
      });

      this.props.firebase.scavengerHuntTasks(ac).get()
      .then(querySnapshot => {
        let tasks = [];
        querySnapshot.forEach(doc => {
          let task = doc.data();
          tasks.push(task.name);
        });

        // console.log("Subs: ",tasksCompleted);
        // console.log("tasks: ",tasks);

        tasks.forEach(task => {
          if(!tasksCompleted.includes(task)) {
            tasksInProgess.push(task);
          }
        });
        
        this.setState({ 
          tasksCompleted,
          tasksInProgess,
          loading: false,
        })
      });
    });
  }

  // componentWillUnmount() {
  //     this.unsubscribe();
  // }

  render() {
    const { tasksCompleted, tasksInProgess, loading } = this.state;
    const URL = this.props.match.url;

    return (
      <div>
        <h2>Tasks</h2>
        {loading && <div>Loading ...</div>}
        <h3>Tasks Completed</h3>
        {tasksCompleted.map(task => (
            <div key={task}>
              <Link to={`${URL}/${task}`}>
                {task}
              </Link>
            </div>
        ))}
        <h3>Tasks In-Progress</h3>
        {tasksInProgess.map(task => (
            <div key={task}>
                {task}
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(CompletionList));