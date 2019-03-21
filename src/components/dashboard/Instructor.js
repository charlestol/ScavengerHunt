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

class Instructor extends Component {
    constructor(props) {
      super(props);
      this.state = {
        signingOut: false,
        signedOut: false
      }
      this.onSignOut = this.onSignOut.bind(this);
    }
   
    componentDidMount() {
        console.log('INSTRUCTOR')
    }
    onSignOut() {
        let self = this;
        this.setState({ signingOut: true })
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('on click signed out!')
        self.setState({ 
            signedOut: true,
            signingOut: false
        });
      }).catch(function(error) {
        // An error happened.
      });
    }
  
    render() {
        const {signedOut, signingOut} = this.state;
        console.log('RENDERING')


    //   let isAuth = true;
    //   firebase.auth().onAuthStateChanged(
    //     (user) => {
    //       console.log("onAuthStateChanged: " + !!user);
    //         isAuth = !!user;
    //     })

        // if(signingOut) {
        //     console.log('signing out')
        //     return null;
        // }

      if(signedOut) {
        console.log('signed out')
        return <Redirect to='/'/>
        }


        console.log('signed in!')
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

export default Instructor;