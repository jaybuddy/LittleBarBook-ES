import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';
import DrinkCard from '../DrinkCard';

const masonryOptions = {
  transitionDuration: 0,
};

class BookContainer extends React.Component {
  render() {
    const drinks = this.props.drinks
      ? this.props.drinks.map(drink => <DrinkCard key={drink._id} drink={drink} />)
      : 'Loading';

    return (
      <Masonry
        options={masonryOptions} // default {}
        disableImagesLoaded={false} // default false
        updateOnEachImageLoad={false}
      >
        {drinks}
      </Masonry>
    );
  }
}

BookContainer.propTypes = {
  drinks: PropTypes.array,
};

export default BookContainer;
