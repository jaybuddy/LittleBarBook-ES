import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Ingredient from './Ingredient';

const Ingredients = styled.div`
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

const SmallBoldText = styled.span`
  font-size: 12px;
  color: #515151;
  font-weight: 800;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style-position: inside;
`;

const IngredientList = (props) => {
  return (
    <Ingredients>
      <SmallBoldText>Ingredients:</SmallBoldText> <br />
      <List>
        {(props.ingredients && props.ingredients.length > 0)
          ? props.ingredients.map(
            ingredient => <Ingredient key={ingredient._id} ingredient={ingredient} />,
          )
          : <SmallText>None</SmallText>}
      </List>
    </Ingredients>
  );
};

IngredientList.propTypes = {
  ingredients: PropTypes.object,
};

export default IngredientList;
