import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyB_BOnrLIbOsgFf2U84pOXYJagwGPltLaM",
  authDomain: "cziscavengerhunt.firebaseapp.com",
  databaseURL: "https://cziscavengerhunt.firebaseio.com",
  projectId: "cziscavengerhunt",
  storageBucket: "cziscavengerhunt.appspot.com",
  messagingSenderId: "812384034022"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.fieldValue = app.firestore.FieldValue;

    this.time = app.firestore.Timestamp;

    this.auth = app.auth();

    this.db = app.firestore();

    this.store = app.storage();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.email)
          .get()
          .then(snapshot => {
            const dbUser = snapshot.data();

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });


  // *** User API ***;

  currentUser = () => this.auth.currentUser;

  user = email => this.db.doc(`users/${email}`);

  userHistory = email => this.user(email).collection('history');

  addToUserHistory = (email, accessCode) => this.user(email).collection('history').doc(accessCode);

  users = () => this.db.collection('users');

  // *** Scavenger Hunt API ***
  scavengerHunts = () => this.db.collection('scavengerHunts');
  scavengerHunt = accessCode => this.db.doc(`scavengerHunts/${accessCode}`);

  scavengerHuntMembers = accessCode => this.scavengerHunt(accessCode).collection('members');
  scavengerHuntMember = (accessCode, email) => this.scavengerHuntMembers(accessCode).doc(email);

  scavengerHuntTasks = accessCode => this.scavengerHunt(accessCode).collection('tasks');
  scavengerHuntTask = (accessCode, task) => this.scavengerHunt(accessCode).collection('tasks').doc(task);

  scavengerHuntSubmissions = (accessCode, email) => this.scavengerHuntMember(accessCode, email).collection('submissions');
  scavengerHuntSubmission = (accessCode, email, task) => this.scavengerHuntMember(accessCode, email).collection('submissions').doc(task);

  time = () => this.time;

  store = () => this.store;

  fieldValue = () => this.fieldValue;
}

export default Firebase;
