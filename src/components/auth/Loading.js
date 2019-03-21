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

      }
    }
  
    componentDidMount() {
        console.log('LOADING')
    }

    render() {
        const { userType } = this.state;
        let isAuth = false;
        firebase.auth().onAuthStateChanged(
            (user) => {
                console.log("onAuthStateChanged: " + !!user);
                isAuth = !!user;
            }
        )
        if(isAuth) {
            console.log('USER SIGNED IN: ', isAuth)
            return <Redirect to={'/'+userType} />
        }  
        return <Redirect to='/signin'/>
        
    }
}

export default Loading;