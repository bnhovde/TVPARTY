import styled from 'styled-components';

import variables from './../constants/variables';
import media from '../utilities/breakpoints';

const { fontSizes, colors } = variables;

const H1 = styled.h1`
  font-size: ${fontSizes.h1.small};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: 'Permanent Marker', cursive;
  text-shadow: 5px 5px #000000;
  color: white;
  margin: 0;
  line-height: 1.4;
  ${media.teen`
    font-size: ${fontSizes.h1.large};
  `};
`;

const H2 = styled.h2`
  font-size: ${fontSizes.h2.small};
  font-family: 'Permanent Marker', cursive;
  margin: 0;
  line-height: 1.4;
  ${media.teen`
    font-size: ${fontSizes.h2.large};
  `};
`;

export { H1, H2 };
