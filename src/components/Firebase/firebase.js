import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

    this.auth = app.auth();

    this.db = app.firestore();
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

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }

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

  user = email => this.db.doc(`users/${email}`);

  users = () => this.db.collection('users');

  // *** Scavenger Hunt API ***

  scavengerHunt = accessCode => this.db.doc(`scavengerHunts/${accessCode}`);

  scavengerHunts = () => this.db.collection('scavengerHunts');
}

export default Firebase;