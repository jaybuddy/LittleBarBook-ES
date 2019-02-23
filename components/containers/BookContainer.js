import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'react-bootstrap';
import DrinkCard from '../DrinkCard';

class BookContainer extends React.Component {

  render() {
    return (
      <Row>
        <Col xs={{ span: 12 }}>
          <Card>
            <Card.Body>
              { this.props.drinks ? this.props.drinks.map(drink => <DrinkCard key={drink._id} drink={drink} />) : 'loading' }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
}

BookContainer.propTypes = {
  drinks: PropTypes.array,
};

export default BookContainer;
