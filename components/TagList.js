import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tag from './Tag';

const Tags = styled.div`
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

const List = styled.div`
  margin: 0;
  padding: 0;
  list-style-position: inside;
`;

const TagList = (props) => {
  return (
    <Tags>
      <SmallBoldText>Tags:</SmallBoldText> <br />
      <List>
        {(props.tags && props.tags.length > 0)
          ? props.tags.map(tag => <Tag key={tag._id} tag={tag} />)
          : <SmallText>None</SmallText>}
      </List>
    </Tags>
  );
};

TagList.propTypes = {
  tags: PropTypes.object,
};

export default TagList;
