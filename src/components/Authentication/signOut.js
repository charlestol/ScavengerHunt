import React from 'react';
import { Button } from "reactstrap"
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <div>
    <Button color="danger" onClick={firebase.doSignOut}>
      Sign Out
    </Button>
  </div>
);

export default withFirebase(SignOutButton);
