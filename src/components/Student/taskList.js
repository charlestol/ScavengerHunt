import React, { Component } from 'react';
import { Spinner } from 'reactstrap'
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      tasks: [],
      completed: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let ac = this.props.match.params.eventId;
    let email = this.props.email;
    let tasks = [];
    let completedTasks = {};
    let completed = [];

    this.props.firebase.scavengerHuntSubmissions(ac, email).get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let data = doc.data();
        completedTasks[data.taskName] = data;
        completed.push(data.taskName);
      })
      // console.log("comp ",completed)
      this.props.firebase.scavengerHuntTasks(ac).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            let data = doc.data();
            let taskName = data.name;
            if(!completedTasks.hasOwnProperty(taskName)) {
              tasks.push(taskName);
            }
        });
        // console.log(tasks)

        this.setState({
          tasks,
          completed,
          loading: false,
        });
      });
    })
  }

  render() {
    const { tasks, completed, loading } = this.state;
    // console.log('list', tasks)
    const URL = this.props.match.url;

    return (
      <div>
        {loading && <Spinner color="danger" />}
        {tasks.length !== 0 && <h4>Tasks In-Progress</h4>}
        {tasks.length !== 0 && tasks.map(task => (
            <div key={task}>
                <Link to={`${URL}/${task}`} className="text-danger"><h5 className="my-3">{task}</h5></Link>
            </div>
        ))}
        {completed.length !== 0 && <h4>Tasks Completed</h4>}
        {completed.length !== 0 && completed.map(task => (
            <div key={task}>
                <Link to={`${URL}/${task}`} className="text-danger"><h5 className="my-3">{task}</h5></Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(EventList));