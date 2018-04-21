import styled from 'styled-components';

import media from '../utilities/breakpoints';

const DesktopView = styled.div`
  display: none;
  ${media.teen`
    display: block;
  `};
`;

const MobileView = styled.div`
  display: block;
  ${media.teen`
    display: none;
  `};
`;

export { DesktopView, MobileView };
