import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Head from '../components/head';
import Navigation from '../components/navigation';
import { fetchUser } from '../reducers/users/actions';
import LoginBox from '../components/login';

class Login extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchUser());
  }

  render() {
    return (
      <div>
        <Head />
        <Container fluid={true} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Row>
            <Col>
              <Navigation user={this.props.user}/>
              <LoginBox />
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
