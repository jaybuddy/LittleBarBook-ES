import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

class BookContainer extends React.Component {
  render() {
    return (
      <Row>
        <Col xs={{ span: 12 }}>
          <Card>
            <Card.Body>
              Application body
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default BookContainer;
