import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';

const Tag = props => <Badge variant="primary">{props.tag.name}</Badge>;

Tag.propTypes = {
  tag: PropTypes.object,
};

export default Tag;
