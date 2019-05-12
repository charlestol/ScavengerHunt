import React from 'react';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import SH from '../../assets/czilogodetailedmap.png'
import { Media, Container, Col } from 'reactstrap';

const imgStyle = {
  maxWidth: 350,
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
};

const Landing = () => (
  <div>
    <h3>Let's Go Scavenger Hunting!</h3>
    <Media style={imgStyle} src={SH} className="my-3" />
    <Link to={ROUTES.SIGN_IN}><h3>Sign In</h3></Link>
  </div>
);

export default Landing;