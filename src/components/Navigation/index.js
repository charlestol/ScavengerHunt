import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import { SignOut} from '../Authentication';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem 
} from 'reactstrap';

export default class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false
    }
    this.toggle = this.toggle.bind(this);
  }
  
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return (
      <div>
        <AuthUserContext.Consumer>
          {authUser => (
            <Navbar color="light" light expand="md">
              <NavbarBrand href="/"><h3>SeekIt</h3></NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>             
              {authUser && authUser.role === ROLES.STUDENT &&
                <NavigationAuthStudent />
              }
              {authUser && authUser.role === ROLES.INSTRUCTOR &&
                <NavigationAuthInstructor />
              }
              {!authUser &&
                <NavigationNoAuth />
              }
              </Collapse>
            </Navbar>
          )}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

const NavigationNoAuth = () => (
  <Nav className="ml-auto" navbar>
    <NavItem>
      <NavLink href={ROUTES.LANDING} className="text-uppercase">Home</NavLink>
    </NavItem>
  </Nav>
);

const NavigationAuthStudent = () => (
  <Nav className="ml-auto" navbar>
    <NavItem>
      <NavLink href={ROUTES.HOME} className="text-uppercase">Home</NavLink>
    </NavItem>
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret className="text-uppercase">
        Account
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>
         <Link to={ROUTES.ACCOUNT}>View My Account</Link>
        </DropdownItem>
        <DropdownItem>
          <SignOut />
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </Nav>
);

const NavigationAuthInstructor = () => (
  <Nav className="ml-auto" navbar>
    <NavItem>
      <NavLink href={ROUTES.ADMIN} className="text-uppercase">Home</NavLink>
    </NavItem>
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret className="text-uppercase">
        Account
      </DropdownToggle>
      <DropdownMenu right>
        <DropdownItem>
         <Link to={ROUTES.ACCOUNT}>View My Account</Link>
        </DropdownItem>
        <DropdownItem>
          <SignOut />
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  </Nav>
);
