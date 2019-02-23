import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SmallText = styled.span`
  font-size: 12px;
  color: #515151;
  font-weight: 400;
  margin-left: -10px;
`;

const Item = styled.li`
  padding-left: 5px;
`;

const Ingredient = props => (
  <Item>
    <SmallText>
      {props.ingredient.name} {props.ingredient.notes}
    </SmallText>
  </Item>
);

Ingredient.propTypes = {
  ingredient: PropTypes.object,
};

export default Ingredient;
