import React from 'react';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div>
    <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </div>
);

export default Landing;