import React, { Component } from 'react';
import { Spinner } from 'reactstrap'
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';
import TaskCreate from './taskCreate';

class EventList extends Component {
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

    this.props.firebase.scavengerHuntTasks(ac)
    .onSnapshot(querySnapshot => {
        let tasks = [];
        querySnapshot.forEach(doc => {
            let data = doc.data();
            tasks.push(data);
        });

        this.setState({
          tasks,
          loading: false,
        });
      });
  }

  render() {
    const { tasks, loading } = this.state;
    // console.log('list', tasks)
    const URL = this.props.match.url;

    return (
      <div className="my-4">
        <h4>Tasks</h4>
        <TaskCreate />
        {loading && <Spinner color="danger" />}
        {tasks.map(task => (
            <div key={task.name}>
                <Link to={`${URL}${task.name}`} className="text-danger">{task.name}</Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(EventList));