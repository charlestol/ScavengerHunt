import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import firebase from 'firebase';
import { createStore, withStore } from "@spyna/react-store";

require('../../config/config');
const db = firebase.firestore();

class SignUp extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        userType: this.props.userType,
        studentID: '',
        userSignedIn: this.props.userSignedIn
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
    componentDidMount() {
        console.log('signup')
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
        userSignedIn
      } = this.state;
    
      if(userSignedIn) {
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

  export default withStore(SignUp);