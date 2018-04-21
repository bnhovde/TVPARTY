import styled from 'styled-components';

import variables from './../constants/variables';
import media from '../utilities/breakpoints';

const {
  fontSizes,
  colors,
  gutter,
} = variables;

const TextArea = styled.div`
  font-size: ${fontSizes.text.small};
  font-weight: 100;
  color: ${colors.text};
  margin: 0;
  line-height: 1.4;
  ${media.teen`
    font-size: ${fontSizes.text.large};
  `}
  & > p {
    margin-bottom: ${gutter.fixed / 2}rem;
  }
`;

export {
  TextArea,
};
