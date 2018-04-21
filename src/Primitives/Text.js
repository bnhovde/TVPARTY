import styled from 'styled-components';

import variables from './../constants/variables';
import media from '../utilities/breakpoints';

const { fontSizes, colors, gutter } = variables;

const TextBold = styled.span`
  letter-spacing: 0.5px;
  font-family: 'Permanent Marker', cursive;
  font-size: ${fontSizes.h2.large};
  color: white;
`;

const TextBlack = styled.p`
  font-family: 'Permanent Marker', cursive;
  color: black;
`;

const Text = styled.p`
  font-family: 'Permanent Marker', cursive;
  font-size: ${fontSizes.h3.small};

  ${media.teen`
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: ${fontSizes.h3.large};
  `};
`;

const LargeText = styled.p`
  font-family: 'Permanent Marker', cursive;
  font-size: ${fontSizes.h2.small};

  ${media.teen`
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: ${fontSizes.h2.large};
  `};
`;

export { Text, TextBold, TextBlack, LargeText };
