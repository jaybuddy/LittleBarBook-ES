import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { connect } from 'react-redux';
import Head from '../components/head';
import Navigation from '../components/navigation';
import { fetchUser } from '../reducers/users/actions';

class Book extends React.Component {
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
              <Navigation user={this.props.user} />
              <Link href="/login">
                <a>Application Page</a>
              </Link>
              <p>Hello Next.js</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Book.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Book);
