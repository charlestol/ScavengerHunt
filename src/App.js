import React, { Component, Fragment } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Link,
//   Redirect,
//   withRouter
// } from "react-router-dom";
import firebase from 'firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { auth: false };
    this.onAuth = this.onAuth.bind(this);
  }

  onAuth() {
    this.setState({
      auth: true
    });
  }

  render() {
    console.log(this.state.auth);
    return( 
      <Fragment>
        <SignIn onAuth={this.onAuth} />
        <SignUp onAuth={this.onAuth} />
      </Fragment>
    );
  }
}

class Dashboard extends Component {

}

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  onSignIn() {
    const {email, password} = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log(user.firstName);

              console.log(user);
          } else {
            // No user is signed in.
          }
        });
        
        this.props.onAuth();
      })
      .catch(function(error) {
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
      password
    } = this.state;
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
      studentID: ''
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
    const { email, password } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      var user = firebase.auth().currentUser;
      user.firstName = 'John'
      console.log('Signed Up');
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
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
      userType: 'Student'
    });
  }

  onClickInstructor() {
    this.setState({
      userType: 'Instructor'
    });
  }

  render() {
    const { firstName, lastName, email, password } = this.state;
    return(
      <div>
            {/* {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            } */}
            <p>Sign Up</p>
            <button onClick={this.onSignUp}>Sign Up</button>
            <button onClick={this.onSignUp}>Sign Up</button>

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
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={this.onChangeLastName}
              style={{if}}
            /><br />
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
          </div>
    );
  }
}