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


class Dashboard extends Component {
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
        
      let isAuth = false;
      firebase.auth().onAuthStateChanged(
          (user) => {
              console.log("onAuthStateChanged: " + !!user);
              isAuth = !!user;
          }
      )
      if(!isAuth) {
          return <Redirect to='/dashboard' />
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
  export default Dashboard;