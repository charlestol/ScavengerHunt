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


class Loading extends Component {
    constructor(props) {
      super(props); 
  
      this.state = {
        userType: this.props.userType,
        userSignedIn: this.props.isAuthed
      }
    }
  
    render() {
      const {userSignedIn, userType} = this.state;

         if(userSignedIn) {
           return <Redirect to={'/'+userType} />
         } else {
           return <Redirect to='/signin'/>
         }
             
    }
  }
   
  export default withStore(Loading);