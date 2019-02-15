import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default () => (
  <div>
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Little Bar Book</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
        <Nav className="pull-right">
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/register">Register</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);