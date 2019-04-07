import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

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

    this.props.firebase.scavengerHuntTasks(this.props.accessCode)
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

//   componentWillUnmount() {
//     this.unsubscribe();
//   }

  render() {
    const { tasks, loading } = this.state;
    console.log('list', tasks)

    return (
      <div>
        <h2>Tasks</h2>
        {loading && <div>Loading ...</div>}
        {tasks.map(task => (
            <div key={task.name}>
                {task.name}
            </div>
        ))}
      </div>
    );
  }
}

export default withFirebase(EventList);