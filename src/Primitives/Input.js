import styled from 'styled-components';

import variables from './../constants/variables';

const { fontSizes, colors, gutter } = variables;

const Input = styled.input`
  width: 100%;
  color: ${colors.text};
  margin: 0;
  padding: 0 ${gutter.horizontal / 2}vw;
  line-height: 3rem;
  font-size: ${fontSizes.text.tiny};
  text-align: ${props => (props.centered ? 'center' : 'left')};
  background: white;
  border: 0;
`;

export { Input };
