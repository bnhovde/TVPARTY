import styled from 'styled-components';
import { Link } from 'react-router';

import variables from './../constants/variables';
import media from '../utilities/breakpoints';

const {
  fontSizes,
} = variables;

const Logo = styled(Link)`
  font-size: ${fontSizes.logo.small};
  line-height: 1;
  color: white;
  vertical-align: middle;
  ${media.teen`
    font-size: ${fontSizes.logo.large};
  `}
`;

export {
  Logo,
};
