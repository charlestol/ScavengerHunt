import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyB_BOnrLIbOsgFf2U84pOXYJagwGPltLaM",
  authDomain: "cziscavengerhunt.firebaseapp.com",
  databaseURL: "https://cziscavengerhunt.firebaseio.com",
  projectId: "cziscavengerhunt",
  storageBucket: "cziscavengerhunt.appspot.com",
  messagingSenderId: "812384034022"
};
firebase.initializeApp(config);

var db = firebase.firestore();
  
class App extends Component {

  render() {
    var citiesRef = db.collection('users').doc('userTypes').collection('students');
var allCities = () => {citiesRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
}
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>]
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <script>{allCities()}</script>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
