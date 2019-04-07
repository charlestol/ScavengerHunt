import React from 'react';

import { AuthUserContext } from '../Session';
import PasswordForgetForm from './passwordForget';
import PasswordChangeForm from './passwordChange';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h2>Name: {authUser.displayName}</h2>
        <h2>Email: {authUser.email}</h2>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

export default AccountPage;