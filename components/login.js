import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import fetch from 'isomorphic-fetch';
import { toastr } from 'react-redux-toastr';
import Router from 'next/router';
import LoginForm from './forms/login';

class Login extends React.Component {
  submit = (values) => {
    fetch('/api/v1/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then(res => res.json())
      .then((data) => {
        if (data.status >= 401) {
          toastr.error('Username or password is incorrect. Please try again.', { showCloseButton: false });
        } else {
          Router.push('/app');
        }
      });
  }

  render() {
    return (
      <Row>
        <Col
          xs={{ span: 10, offset: 1 }}
          sm={{ span: 8, offset: 2 }}
          md={{ span: 6, offset: 3 }}
          lg={{ span: 4, offset: 4 }}
        >
          <Card>
            <Card.Body>
              <LoginForm onSubmit={this.submit} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
}
export default Login;
