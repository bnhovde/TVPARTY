/**
*
* Loader
*
*
*/
import React from 'react';
import styled from 'styled-components';
import variables from './../../constants/variables';

import { SunburstScreen } from './../../Primitives/Screen';
import { H1 } from './../../Primitives/H';

const { colors } = variables;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.secondary};
  z-index: 5;
`;

function Loader(props) {
  const { text = 'laster..' } = props;

  return (
    <Wrapper>
      <SunburstScreen />
      <H1>TVPARTY</H1>
    </Wrapper>
  );
}

export default Loader;
