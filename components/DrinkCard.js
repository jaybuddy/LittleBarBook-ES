import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col, Card } from 'react-bootstrap';
import IngredientList from './IngredientList';
import TagList from './TagList';

const DrinkCard = (props) => {
  const styles = {
    marginTop: '25px',
  };

  const Heading = styled.span`
    font-weight: 800;
  `;

  return (
    <Col
      xs={{ span: 12 }}
      sm={{ span: 12 }}
      md={{ span: 6 }}
      lg={{ span: 4 }}
      xl={{ span: 4 }}
    >
      <div style={styles}>
        <Card>
          <Card.Header>
            <Heading>{props.drink.name}</Heading>
          </Card.Header>
          <Card.Body>
            <IngredientList ingredients={props.drink.Ingredients} />
            <TagList tags={props.drink.Tags} />
          </Card.Body>
        </Card>
      </div>
    </Col>
  );
};

DrinkCard.propTypes = {
  drink: PropTypes.object,
};

export default DrinkCard;
