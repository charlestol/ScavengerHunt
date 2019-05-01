import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
// import CreateTask from './createTask';
// import ListTasks from './taskList';
// import EventMembers from './eventMembers';
import { Spinner } from 'reactstrap'
import DashNav from './navigation'

class EventItem extends Component {
  state = { 
    loading: false,
    sh: {}
  }

  componentDidMount() {
    let ac = this.props.match.params.eventId;
    this.setState({
      loading: true
    });

    this.props.firebase.scavengerHunt(ac).get()
    .then(doc => {
      if(doc.exists) {
        const data = doc.data();
        this.setState({
          sh: data,
          loading: false
        });
      }
    })
  }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  render() {
    const { loading, sh } = this.state;


    let dueDate = '';

    if(sh.hasOwnProperty('dateEnd')) {
      let dateTS = new Date(sh.dateEnd.seconds*1000);

      const months = {
        0:"January",
        1:"February",
        2:"March",
        3:"April",
        4:"May",
        5:"June",
        6:"July",
        7:"August",
        8:"September",
        9:"October",
        10:"November",
        11:"December"
      }

      let month = months[Number(dateTS.getMonth())]
      let day = dateTS.getDate()
      let year = dateTS.getFullYear()

      dueDate = `${month} ${day}, ${year} at `;

      let hours = dateTS.getHours()
      let minutes = dateTS.getMinutes()

      if (hours > 0 && hours <= 12) {
        dueDate += hours;
      } else if (hours > 12) {
        dueDate += "" + (hours - 12);
      } else if (hours === 0) {
        dueDate += "12";
      }
      dueDate += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
      dueDate += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM
    }
    return (
      <div className="my-4">
        {loading && <Spinner color="danger" />}
        {sh.accessCode && 
          <div>
            <h4>Event: {sh.name}</h4>
            <p><strong>Courses:</strong> {sh.courses}</p>
            <p><strong>Description:</strong> {sh.description}</p>            
            <p><strong>Due:</strong> {dueDate}</p>

            <DashNav />
          </div>
        }
      </div>
    )
  }
}
export default withRouter(withFirebase(EventItem));