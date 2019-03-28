import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  studentID: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
}

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { firstName, lastName, studentID, email, passwordOne, isAdmin } = this.state;
    const roles = [];

    if (isAdmin) {
      roles.push(ROLES.ADMIN);
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firestore database
        return this.props.firebase.user(authUser.user.email).set(
          (isAdmin) ? {
            firstName,
            lastName,
            email,
            roles
          } : {
            firstName,
            lastName,
            email,
            studentID,
            roles
          },
          { merge: true },
        )
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onClickStudent = () => {
    this.setState({isAdmin: false})
  }
  onClickInstructor = () => {
    this.setState({isAdmin: true})
  }

  render() {
    const {
      firstName,
      lastName,
      studentID,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstName === '' ||
      lastName === '';

      return (
        <div>
          <button onClick={this.onClickStudent}>Student</button>
          <button onClick={this.onClickInstructor}>Instructor</button>
          <form onSubmit={this.onSubmit}>
            <input
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            <br />
            <input
              name="firstName"
              value={firstName}
              onChange={this.onChange}
              type="text"
              placeholder="First Name"
            />
            <br />
            <input
              name="lastName"
              value={lastName}
              onChange={this.onChange}
              type="text"
              placeholder="Last Name"
            />
            <br />          
            {
              !isAdmin &&
              <div>
                <input
                  name="studentID"
                  value={studentID}
                  onChange={this.onChange}
                  type="text"
                  placeholder="Student ID"
                />
                <br />
              </div>
            }
            <input
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            <br />
            <input
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />
            <br />
            <button disabled={isInvalid} type="submit">
              Sign Up
            </button>
            <br />
            {error && <p>{error.message}</p>}
          </form>
        </div>
      );
    }
  }

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };