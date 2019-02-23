import React from 'react';
import PropTypes from 'prop-types';
import DrinkCard from '../DrinkCard';

const BookContainer = (props) => {
  return props.drinks ? props.drinks.map(drink => <DrinkCard key={drink._id} drink={drink} />) : 'loading';
}

BookContainer.propTypes = {
  drinks: PropTypes.array,
};

export default BookContainer;
