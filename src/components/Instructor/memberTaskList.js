import React, { Component } from 'react';
import { Spinner } from 'reactstrap'
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

    this.unsubscribe = this.props.firebase.scavengerHuntSubmissions(ac, email)
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

  componentWillUnmount() {
      this.unsubscribe();
  }

  render() {
    const { tasksCompleted, tasksInProgess, loading } = this.state;
    const URL = this.props.match.url;

    return (
      <div>
        {loading && <Spinner color="danger" />}
        {tasksCompleted.length !== 0 &&
          <div>
            <h4>Tasks Completed</h4>
            {tasksCompleted.map(task => (
                <div key={task}>
                  <Link to={`${URL}/${task}`} className="text-danger">
                  <h5 className="my-3">{task}</h5>
                  </Link>
                </div>
            ))}
          </div>
        }
        {tasksInProgess.length !== 0 &&
          <div>
            <h4>Tasks In-Progress</h4>
            {tasksInProgess.map(task => (
                <div key={task}>
                    <h5 className="my-3">{task}</h5>
                </div>
              ))}
          </div>
        }
      </div>
    );
  }
}

export default withRouter(withFirebase(CompletionList));