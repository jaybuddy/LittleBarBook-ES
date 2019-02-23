import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Head from '../components/head';
import Navigation from '../components/navigation';
import { fetchDrinks } from '../reducers/drinks/actions';
import { fetchUser } from '../reducers/users/actions';
import BookContainer from '../components/containers/BookContainer';

class Book extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchUser());
    this.props.dispatch(fetchDrinks());
  }

  render() {
    return (
      <div>
        <Head />
        <Container fluid={true} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Row>
            <Col>
              <Navigation user={this.props.user} />
            </Col>
          </Row>
        </Container>
        <Container fluid={true} style={{ padding: 15 }}>
          <Row>
            <BookContainer drinks={this.props.drinks.data.Drinks} />
          </Row>
        </Container>
      </div>
    );
  }
}

Book.propTypes = {
  dispatch: PropTypes.func,
  user: PropTypes.object,
  drinks: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.user,
  drinks: state.drinks,
});

export default connect(mapStateToProps)(Book);
