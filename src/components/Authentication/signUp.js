import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Media, Container, Button, Form, FormGroup, Label, Input, FormText, Alert, Col } from 'reactstrap';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { compose } from 'recompose';
import SH from '../../assets/appfavi.png'

const SignUpPage = () => (
  <div>
    <Media style={imgStyle} src={SH} className="mb-3" />
    <h4 className="mb-3">SignUp</h4>
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
  role: ROLES.STUDENT,
  error: null
}

const imgStyle = {
  maxWidth: 256,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};

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
    const { firstName, lastName, studentID, email, passwordOne, role } = this.state;
    // const roles = [];

    // if (isAdmin) {
    //   roles.push(ROLES.ADMIN);
    // }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firestore database
        this.props.firebase.user(authUser.user.email).set(
          (role === ROLES.INSTRUCTOR) ? {
            firstName,
            lastName,
            email,
            role
          } : {
            firstName,
            lastName,
            email,
            studentID,
            role
          },
          { merge: true },
        )
      })
      .then(() => {
        const userRole = role;
        this.setState({ ...INITIAL_STATE });
        if(userRole===ROLES.STUDENT) {
          this.props.history.push(ROUTES.HOME);
        } else {
          this.props.history.push(ROUTES.ADMIN);
        }
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
    this.setState({role: ROLES.STUDENT})
  }
  onClickInstructor = () => {
    this.setState({role: ROLES.INSTRUCTOR})
  }

  render() {
    const {
      firstName,
      lastName,
      studentID,
      email,
      passwordOne,
      passwordTwo,
      role,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      firstName === '' ||
      lastName === '';

    let isStudent = role===ROLES.STUDENT;

    console.log(role);

      return (
        <Container>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Button outline color="danger" onClick={this.onClickStudent} active={isStudent} className="mb-3 mx-1 rounded-sm">Student</Button>
            <Button outline color="danger" onClick={this.onClickInstructor} active={!isStudent} className="mb-3 mx-1 rounded-sm">Instructor</Button>
            <Form onSubmit={this.onSubmit}>
              <Input
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
                className="mb-3 rounded-sm"
              />
              <Input
                name="firstName"
                value={firstName}
                onChange={this.onChange}
                type="text"
                placeholder="First Name"
                className="mb-3 rounded-sm"
              />
              <Input
                name="lastName"
                value={lastName}
                onChange={this.onChange}
                type="text"
                placeholder="Last Name"
                className="mb-3 rounded-sm"
              />
              {
                role===ROLES.STUDENT &&
                <div>
                  <Input
                    name="studentID"
                    value={studentID}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Student ID"
                    className="mb-3 rounded-sm"
                  />
                </div>
              }
              <Input
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
                className="mb-3 rounded-sm"
              />
              <Input
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Confirm Password"
                className="mb-3 rounded-sm"
              />
              <Button disabled={isInvalid} color="danger" type="submit" className="mb-3 rounded-sm">
                Sign Up
              </Button>
              <br />
              {error && <Alert color="danger">{error.message}</Alert>}
            </Form>
            <SignInLink />
          </Col>
        </Container>
      );
    }
  }

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignInLink = () => (
  <p>
    Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const SignUpForm = compose( 
  withRouter,
  withFirebase,
)(SignUpFormBase);


export default SignUpPage;

export { SignUpForm, SignUpLink };