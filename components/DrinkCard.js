import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col, Card, Badge } from 'react-bootstrap';

const DrinkCard = (props) => {
  const styles = {
    marginTop: '25px',
  };

  const Heading = styled.span`
    font-weight: 800;
  `;

  const Badges = styled.div`
    display: block;
    margin-top: 10px;
    padding-top: 5px;
    border-top: 1px solid #CCCCCC;
  `;

  const SmallText = styled.span`
    font-size: 12px;
    color: #515151;
    font-weight: 400;
  `;

  return (
    <Col xs={{ span: 12 }} sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 3 }}>
      <div style={styles}>
        <Card>
          <Card.Header>
            <Heading>{props.drink.name}</Heading>
          </Card.Header>
          <Card.Body>
            <Badges>
              <SmallText>Tags:</SmallText> <br />
              {(props.drink.Tags && props.drink.Tags.length > 0)
                ? props.drink.Tags.map(tag => <Tag key={tag._id} tag={tag} />)
                : <SmallText>None</SmallText>}
            </Badges>
          </Card.Body>
        </Card>
      </div>
    </Col>
  );
};

DrinkCard.propTypes = {
  drink: PropTypes.object,
};

const Tag = props => <Badge variant="primary">{props.tag.name}</Badge>;

Tag.propTypes = {
  tag: PropTypes.object,
};

export default DrinkCard;
