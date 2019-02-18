import React from 'react';
import { Form, Button } from 'react-bootstrap';

const LoginForm = () => (
  <Form>
    <Form.Group controlId="email">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Email Address" />
    </Form.Group>

    <Form.Group controlId="password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" />
    </Form.Group>

    <Button variant="primary" type="submit">
      Log me in!
    </Button>
  </Form>
);

export default LoginForm;
