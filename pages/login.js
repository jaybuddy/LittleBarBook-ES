import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { connect } from 'react-redux';
import Head from '../components/head';
import Navigation from '../components/navigation';
import { fetchUser } from '../reducers/users/actions';

class Login extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchUser());
  }

  render() {
    const message = !this.props.user.data.error
      ? 'You are already logged in'
      : 'Go ahead and login';

    return (
      <div>
        <Head />
        <Container fluid={true} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Row>
            <Col>
              <Navigation />
              <p>{message}</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.string,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Login);
