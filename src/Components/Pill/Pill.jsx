/**
*
* Loader
*
*
*/
import React, { PropTypes } from 'react';
import styled from 'styled-components';
import variables from './../../constants/variables';

const { colors } = variables;

const Wrapper = styled.span`
  display: inline-block;
  background-color: ${colors.secondary};
  padding: 0.3rem 0.5rem 0.2rem 0.5rem;
  margin-right: 0.5rem;
  border-radius: 1rem;
  color: white;
  font-size: 0.8rem;
  line-height: 1.2rem;
  white-space: nowrap;
  min-width: 1.7rem;
  text-align: center;
`;

function Pill(props) {
  return <Wrapper>{props.text}</Wrapper>;
}

Pill.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Pill;
