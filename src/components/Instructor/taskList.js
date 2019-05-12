import React, { Component } from 'react';
import { Spinner } from 'reactstrap'
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

class TaskList extends Component {
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

    this.unsub = this.props.firebase.scavengerHuntTasks(ac)
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

  componentWillUnmount() {
    this.unsub();
  }

  render() {
    const { tasks, loading } = this.state;
    // console.log('list', tasks)
    const URL = this.props.match.url;
    return (
      <div>
        <h4>Tasks</h4>
        {loading && <Spinner color="danger" />}
        {!loading && tasks.length===0 && <p>You have not created any scavenger hunt tasks yet.<br />Create tasks for your participants to complete!</p>}
        {tasks.map(task => (
            <div key={task.name}>
                <Link to={`${URL}/${task.name}`} className="text-danger">{task.name}</Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(TaskList));