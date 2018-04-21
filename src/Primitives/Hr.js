import styled from 'styled-components';

import variables from './../constants/variables';

const {
  colors,
} = variables;

const Hr = styled.hr`
  display: block;
  height: 1px;
  margin: 0;
  padding: 0;
  border: 0;
  background-color: ${colors.secondary};
  opacity: 0.3;
`;

export {
  Hr,
};
