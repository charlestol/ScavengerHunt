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

class SignIn extends Component {
    constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        userSignedIn: this.props.userSignedIn,
        userType: this.props.userType,
      }
      this.onChangeEmail = this.onChangeEmail.bind(this);
      this.onChangePassword = this.onChangePassword.bind(this);
      this.onSignIn = this.onSignIn.bind(this);
    }
  
    componentDidMount() {
        console.log('signin')
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
                    userSignedIn: true 
                  });
              } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
                  self.setState({
                    userSignedIn: false
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
        userSignedIn,
        userType
      } = this.state;    
  
      console.log('SignIn: ', userSignedIn)

      if(userSignedIn) {
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

  export default withStore(SignIn);