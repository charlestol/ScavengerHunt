import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import firebase from 'firebase';
require('./config/config');
const db = firebase.firestore();

export default class App extends Component {
  render() {      
    return(
      <Router>
        <div>
          <Route exact path='/' component={Loading} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/student' component={Student} />
          <Route path='/instructor' component={Instructor} />
        </div>
      </Router> 
    );
  }
}


class Student extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedOut: false
    }
    this.onSignOut = this.onSignOut.bind(this);
  }

  onSignOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      this.setState({signOut: true});
    }).catch(function(error) {
      // An error happened.
    });
  }

  render() {
    const {signedOut} = this.state;
    if(signedOut) {
      return <Redirect to='/signin'/>
    }

    return(
      <div>
         <div>
          <button onClick={this.onSignOut}>Sign Out</button>
        </div>
        student
      </div>
    );
  }
}

class Instructor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedOut: false
    }
    this.onSignOut = this.onSignOut.bind(this);
  }

  onSignOut() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      this.setState({signOut: true});    
    }).catch(function(error) {
      // An error happened.
    });
  }

  render() {
    const {signedOut} = this.state;
    if(signedOut) {
      return <Redirect to='/signin'/>
    }

    return(
      <div>
         <div>
          <button onClick={this.onSignOut}>Sign Out</button>
        </div>
        instructor
        <br />
        {/* <CreateScavengerHunt />
        <ListScavengerHunts /> */}
      </div>
    );
  }
}

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

function CheckUserState() {
  
}

class Loading extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      userType: '',
      signedIn: false,
      checkedForUser: false
    }
  }
  componentDidMount() {
    var self = this;
    firebase.auth().onAuthStateChanged(
        (user) => {
          // this.forceUpdate();
          
          console.log("onAuthStateChanged: " + !!user);
          if(!this.state.checkedForUser) {
            if(user) {
              var email = user.email;
              var userRef = db.collection("users").doc(email);
          
              userRef.get().then(function(doc) {
                  if (doc.exists) {
                    self.setState({
                      userType : doc.data().userType,
                      signedIn: true,
                      checkedForUser: true
                  })  
                      // console.log("UT: ",userType);
                  } else {
                      // doc.data() will be undefined in this case
                      console.log("No such document!");
                      self.setState({
                        signedIn: false,
                        checkedForUser: true
                      });
                  }
              }).catch(function(error) {
                  console.log("Error getting document:", error);
              });        
            } else {
              self.setState({
                signedIn: false,
                checkedForUser: true
              });
            }
          }
        }
    );
  }

  render() {
    const {userType, signedIn, checkedForUser} = this.state;

    if(checkedForUser) {
      if(signedIn) {
        return <Redirect to={'/'+userType} />
      } else {
        return <Redirect to='/signin'/>
      }
    }
    return <div>Welcome</div>;
  }
}

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      signedIn: false,
      userType: '',
      checkedForUser: false,
    }
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  

  onSignIn() {
    const {email, password} = this.state;
    var self = this;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      var user = firebase.auth().currentUser;

      if(user) {
        var userRef = db.collection("users").doc(user.email);
        userRef.get().then(function(doc) {
            if (doc.exists) {
                self.setState({ 
                  userType : doc.data().userType, 
                  signedIn: true 
                });
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                self.setState({
                  signedIn: false
                });
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    })
  }

  onChangeEmail(event) {
    this.setState({
      email: event.target.value
    });
  }
  onChangePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  render() {
    const {
      email,
      password,
      userType,
      signedIn
    } = this.state;    

    if(signedIn) {
      return <Redirect to={'/'+userType} />
    }

    return(
      <div>
         {/* {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            } */}
         <p>Sign In</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={this.onChangeEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            />
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
            <br />
            <p>Don't have an account? Sign Up <Link to='/signup'>here</Link></p>
      </div>
    );
  }
}

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      userType: 'student',
      studentID: '',
    }

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onClickStudent = this.onClickStudent.bind(this);
    this.onClickInstructor = this.onClickInstructor.bind(this);
    this.onChangeStudentID = this.onChangeStudentID.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  onSignUp() {
    const { 
      firstName, 
      lastName, 
      studentID, 
      userType, 
      email, 
      password, 
      } = this.state;

    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: firstName,
      }).then(function() {
        // Update successful.
      }).catch(function(error) {
        // An error happened.
      });
      
      // if(userType==='student') {
      //   user.studentID = studentID;
      // }

      // Add a new document in collection 
      db.collection("users").doc(user.email).set(
        (userType==='student') ? {
          firstName: firstName,
          lastName: lastName,
          email: email,
          studentID: studentID,
          uid: user.uid,
          userType: userType
        } : {
          firstName: firstName,
          lastName: lastName,
          email: email,
          uid: user.uid,
          userType: userType
        }
      )
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });

      console.log('Signed Up');
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode ==='auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
  }
  onChangeEmail(event) {
    this.setState({
      email: event.target.value
    });
  }
  onChangePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  onChangeFirstName(event) {
    this.setState({
      firstName: event.target.value
    });
  }
  onChangeLastName(event) {
    this.setState({
      lastName: event.target.value
    });
  }

  onChangeStudentID(event) {
    this.setState({
      studentID: event.target.value
    });
  }

  onClickStudent() {
    this.setState({
      userType: 'student'
    });
  }

  onClickInstructor() {
    this.setState({
      userType: 'instructor'
    });
  }

  render() {
    const { 
      firstName, 
      lastName, 
      studentID, 
      userType, 
      email, 
      password,
    } = this.state;


    var user = firebase.auth().currentUser;

    if(user) {
      return <Redirect to={'/'+userType} />
    }

    return(
      <div>
            {/* {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            } */}
            <p>Sign Up</p>
            <button onClick={this.onClickStudent}>Student</button>
            <button onClick={this.onClickInstructor}>Instructor</button>
            <br />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={this.onChangeFirstName}
            /><br />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={this.onChangeLastName}
            /><br />
            <div style={(userType==='instructor') ? {display: 'none'} : {display: 'inline'}}>
              <input
                type="text"
                placeholder="Student ID"
                value={studentID}
                onChange={this.onChangeStudentID}
              /><br />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={this.onChangeEmail}
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            /><br />
            <button onClick={this.onSignUp}>Sign Up</button>
            <br />
            <p>Already have an account? Sign in <Link to='/'>here</Link></p>
          </div>
    );
  }
}