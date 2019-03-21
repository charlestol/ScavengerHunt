import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import firebase from 'firebase';

require('../../config/config');
const db = firebase.firestore();

class SignIn extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        // userType: this.props.userType,
      }
      this.onChangeEmail = this.onChangeEmail.bind(this);
      this.onChangePassword = this.onChangePassword.bind(this);
      this.onSignIn = this.onSignIn.bind(this);
    }
  
    componentDidMount() {
        console.log('SIGNIN')
    }

    onSignIn() {
      const {email, password} = this.state;
      firebase.auth().signInWithEmailAndPassword(email, password)
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
        password,
      } = this.state;    
  
      let isAuth = false;
      firebase.auth().onAuthStateChanged(
          (user) => {
              console.log("onAuthStateChanged: " + !!user);
              isAuth = !!user;
          }
      )
      if(isAuth) {
          return <Redirect to='/dashboard' />
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

  export default SignIn;