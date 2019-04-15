import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';

class EventList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      tasks: [],
      completed: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    let ac = this.props.match.params.eventId;

    let email = this.props.email;

    this.props.firebase.scavengerHuntTasks(ac)
    .onSnapshot(querySnapshot => {
        let tasks = [];
        let completed = [];
        querySnapshot.forEach(doc => {
            let data = doc.data();
            let task = doc.data().name;
            console.log(data)

           this.props.firebase.scavengerHuntSubmission(ac, email, task).get()
           .then(doc => {
             if(doc.exists) {
               completed.push(data)
             } else {
               tasks.push(data)
             }
           })
        });


        this.setState({
          tasks,
          completed,
          loading: false,
        });
      });
  }

  render() {
    const { tasks, completed, loading } = this.state;
    // console.log('list', tasks)
    const URL = this.props.match.url;

    return (
      <div>
        {loading && <div>Loading ...</div>}
        <h2>On-Going Tasks</h2>
        {tasks.map(task => (
            <div key={task.name}>
                <Link to={`${URL}/${task.name}`}>{task.name}</Link>
            </div>
        ))}
         <h2>Completed Tasks</h2>
        {completed.map(task => (
            <div key={task.name}>
                <Link to={`${URL}/${task.name}`}>{task.name}</Link>
            </div>
        ))}
      </div>
    );
  }
}

export default withRouter(withFirebase(EventList));