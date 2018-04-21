/**
*
* Loader
*
*
*/
import React from 'react';
import styled from 'styled-components';

import Block from './../../../../Primitives/Block';
import { TextBold } from './../../../../Primitives/Text';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Heino = styled.img`
  height: 50%;
  margin-left: 5%;
`;

function HeinoWinner(props) {
  return (
    <Wrapper>
      <Heino
        src={`${process.env.PUBLIC_URL}/assets/letsDrink/heino-winner.svg`}
      />
      <Block top={1}>
        <TextBold>{props.winner.name} Wins the game!</TextBold>
      </Block>
    </Wrapper>
  );
}

export default HeinoWinner;
