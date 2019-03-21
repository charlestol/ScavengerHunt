import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import firebase from 'firebase';
import { createStore, withStore } from "@spyna/react-store";

import Loading from './components/auth/Loading';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Student from './components/dashboard/Student';
import Instructor from './components/dashboard/Instructor';

require('./config/config');
const db = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedForUser: false,
      userSignedIn: false,
      userType: ''
    }
  }
  componentDidMount() {
    let self = this;
    firebase.auth().onAuthStateChanged(
      (user) => {
        console.log("onAuthStateChanged: " + !!user);
        if(!!user) {

          var email = user.email;
          var userRef = db.collection("users").doc(email);
      
          userRef.get().then(function(doc) {
              if (doc.exists) {
                self.setState({
                  checkedForUser: true,
                  userSignedIn: true,
                  userType: doc.data().userType
                });
                console.log(self.state.userType)
                  // console.log("UT: ",userType);
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");

                  self.setState({
                    checkedForUser: true,
                    userSignedIn: false,
                    userType: ''
                  });
              }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });        
        } else {
          self.setState({
            checkedForUser: true,
            userSignedIn: false
          });
          console.log('no user')
        }
      }
    );
  }

  render() {      
    const {checkedForUser, userType, userSignedIn} = this.state;

    if(!checkedForUser) {
      return <div>Welcome</div>
    }

    return(
      <Router>
        <div>
          <Route
            exact path='/'
            render={(props) => <Loading {...props} userSignedIn={userSignedIn} userType={userType} />}
          />
          <Route 
            path='/signin' 
            render={(props) => <SignIn {...props} userSignedIn={userSignedIn} userType={userType} />}
          />
          <Route 
            path='/signup' 
            render={(props) => <SignUp {...props} userSignedIn={userSignedIn} userType={userType} />}
          />
          <Route 
            path='/student' 
            render={(props) => <Student {...props} userSignedIn={userSignedIn} userType={userType} />}
          />
          <Route
            path='/instructor' 
            render={(props) => <Instructor {...props} userSignedIn={userSignedIn} userType={userType} />}
          />
        </div>
      </Router> 
    );
  }
}

const initStates = {
  userType: '',
  userSignedIn: false,
  checkedForUser: false
};

export default createStore(App, initStates);




// class ListScavengerHunts extends Component {
//   render() {
//     var user = firebase.auth().currentUser;
//     var email = user.email;    
    
//     var list = [];
//     function listEvents() {
//       db.collection("scavengerHunts").where("instructorEmail", "==", email)
//         .onSnapshot(function(querySnapshot) {
//           var events = [];
//           querySnapshot.forEach(function(doc) {
//               events.push(doc.data().eventName);
//           });
//           list = events;
//       });
//     }
//     listEvents();
//     console.log(list);
//     return (
//       <div></div>
//     );
//   }
// }

// class CreateScavengerHunt extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       eventName: '',
//       accessCode: '',
//       instructions: ''
//     }
//     this.onChangeEventName = this.onChangeEventName.bind(this);
//     this.onChangeAccessCode = this.onChangeAccessCode.bind(this);
//     this.onChangeInstructions = this.onChangeInstructions.bind(this);
//     this.onCreate = this.onCreate.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);
//   }

//   onSubmit(e) {
//     e.preventDefault();
//   }

//   onChangeEventName(event) {
//     this.setState({
//       eventName: event.target.value
//     });
//   }

//   onChangeAccessCode(event) {
//     this.setState({
//       accessCode: event.target.value
//     });
//   }

//   onChangeInstructions(event) {
//     this.setState({
//       instructions: event.target.value
//     });
//   }

//   onCreate() {
//     const {eventName, accessCode, instructions} = this.state

//     var user = firebase.auth().currentUser;
//     var name = user.displayName;
//     var email = user.email;
    
//     var eventData = {
//       eventName: eventName,
//       instructorName: name,
//       instructorEmail: email,
//       accessCode: accessCode,
//       instructions: instructions
//     };

//     console.log(eventData)

//     db.collection("scavengerHunts").doc(accessCode).set(eventData).then(() => {
//         console.log("Document successfully written!");
//     })
//     .catch(function(error) {
//       console.error("Error writing document: ", error);
//     });
//   }

//   render() {
//     const { eventName, accessCode, instructions } = this.state;
//     return(
//       <div>
//         <form onSubmit={this.onSubmit}>
//           <input
//             type="text"
//             placeholder="Event Name"
//             value={eventName}
//             onChange={this.onChangeEventName}
//           /><br />
//           <input
//             type="text"
//             placeholder="Access Code"
//             value={accessCode}
//             onChange={this.onChangeAccessCode}
//           /><br />
//           <input
//             type="text"
//             placeholder="Instuctions"
//             value={instructions}
//             onChange={this.onChangeInstructions}
//           /><br />
//           <button type='submit' onClick={this.onCreate}>create</button>
//         </form>
//       </div>
//     );
//   }
// }
