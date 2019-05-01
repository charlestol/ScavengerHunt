import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import ListTasks from './taskList';
import EventResults from './eventResults';
import { AuthUserContext } from '../Session';
import { Spinner } from 'reactstrap'
var moment = require('moment');

class EventItem extends Component {
  state = { 
    loading: false,
    sh: {},
    closed: false,
    notStarted: false,
  }

  componentDidMount() {
    let ac = this.props.match.params.eventId;
    this.setState({
      loading: true
    });

    this.props.firebase.scavengerHunt(ac).get()
    .then(doc => {
      const data = doc.data();
      const startDate = data.dateStart.seconds;
      const endDate = data.dateEnd.seconds;
      // converting from millisec to sec to compare to endDate
      const today = (Date.now() / 1000).toFixed(0);

      let sh = data;
      let loading = false;
      let notStarted = false;
      let closed = false;
      const eventClosed = data.closed;


      if(today > endDate || eventClosed) {
        closed = true;
      } else {
        closed = false
      }

      if(startDate > today) {
        notStarted = true;
      } else {
        notStarted = false;
      }

      this.setState({
        sh,
        loading,
        closed,
        notStarted,
      });
    })
  }

  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  render() {
    const { loading, sh, closed, notStarted } = this.state;

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
      <AuthUserContext.Consumer>
        {authUser => (  
          <div>
            {loading && <Spinner color="danger" />}
            {sh.accessCode && 
              <div>
                <h4>Event: {sh.name}</h4>
                <p><strong>Courses:</strong> {sh.courses}</p>
                <p><strong>Description:</strong> {sh.description}</p>            
                <p><strong>Due:</strong> {dueDate}</p>
                {closed && 
                  <p>This event has ended</p>
                }
                <EventResults email={authUser.email} />
                {notStarted && <p>The event has not started</p>}
                {!notStarted && <ListTasks email={authUser.email} />}
              </div>
            }
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }
}
export default withRouter(withFirebase(EventItem));