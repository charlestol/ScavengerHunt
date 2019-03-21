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
        console.log('signed out!')
        this.setState({signedOut: true});
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
  export default Student;