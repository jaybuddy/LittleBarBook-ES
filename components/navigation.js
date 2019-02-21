import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import Router from 'next/router';
import toastr from 'react-redux-toastr';

const onLogoutClick = () => {
  fetch('/api/v1/logout')
    .then(res => res.json())
    .then((data) => {
      if (data.status >= 401) {
        toastr.error('Unable to log you out.', { showCloseButton: false });
      } else {
        toastr.success('You have been logged out.', { showCloseButton: false });
        Router.push('/');
      }
    });
};

const LogOutMenu = props => (
  <Nav className="pull-right">
    <Navbar.Text>
      Signed in as: {props.user.email}
    </Navbar.Text>
    <Nav.Link href="#" onSelect={onLogoutClick}>Logout</Nav.Link>
  </Nav>
);

const LogInMenu = () => (
  <Nav className="pull-right">
    <Nav.Link href="/login">Login</Nav.Link>
  </Nav>
);

const Navigation = props => (
  <div>
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Little Bar Book</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
        {props.user && props.user.data.email ? <LogOutMenu user={props.user.data} /> : <LogInMenu />}
      </Navbar.Collapse>
    </Navbar>
  </div>
);

Navigation.propTypes = {
  user: PropTypes.object,
};

LogOutMenu.propTypes = {
  user: PropTypes.object,
};

export default Navigation;
