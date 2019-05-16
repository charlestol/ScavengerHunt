import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Media, Container, Button, Form, FormGroup, Label, Input, FormText, Alert, Col } from 'reactstrap';
import { SignUpLink } from './signUp';
import { PasswordForgetLink } from './passwordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { withAuthorization } from '../Session';
import SH from '../../assets/czilogodetailedmap.png'

const SignInPage = () => (
  <div>
    <Media style={imgStyle} src={SH} className="mb-3" />
    <h4 className="mb-3">SignIn</h4>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const imgStyle = {
  maxWidth: 256,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        console.log(authUser)
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <Container >
        <Col sm="12" md={{ size: 6, offset: 3 }}>
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
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
              className="mb-3 rounded-sm"
            />
            <Button color="danger" disabled={isInvalid} type="submit" className="mb-3">
              Sign In
            </Button>

            {error && <Alert color="danger" >{error.message}</Alert>}
          </Form>
        </Col>
      </Container>
    );
  }
}

const condition = authUser => !authUser;

const SignInForm = compose(
  withRouter,
  withFirebase,
  withAuthorization(condition)
)(SignInFormBase);

export default SignInPage;

export { SignInForm };