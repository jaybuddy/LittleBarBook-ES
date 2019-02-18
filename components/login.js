import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import LoginForm from './forms/login';

const Login = () => (
  <Row>
    <Col
      xs={{ span: 10, offset: 1 }}
      sm={{ span: 8, offset: 2 }}
      md={{ span: 6, offset: 3 }}
      lg={{ span: 4, offset: 4 }}
    >
      <Card>
        <Card.Body>
          <LoginForm />
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default Login;
