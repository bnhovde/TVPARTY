import styled from 'styled-components';

import variables from './../constants/variables';

const { colors, gutter, fontSizes } = variables;

const Button = styled.button`
  display: block;
  width: 100%;
  line-height: 3rem;
  font-size: ${fontSizes.text.tiny};
  text-transform: uppercase;
  letter-spacing: 1px;
  color: white;
  background-color: ${props => (props.bad ? colors.bad : colors.secondary)};
  border: 0;
  box-shadow: 7px 7px black;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.secondaryDark};
  }

  &:disabled {
    background-color: ${colors.disabled};
  }
`;

// We're extending Button with some extra styles
const InlineButton = Button.extend`
  display: inline-block;
  width: auto;
  padding: 0 ${gutter.horizontal}vw;
`;

export { Button, InlineButton };
