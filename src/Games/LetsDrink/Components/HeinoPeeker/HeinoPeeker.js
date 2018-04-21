/**
*
* Loader
*
*
*/
import React from 'react';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  z-index: 5;
`;

const peekAnimation = keyframes`
  0% { transform: translateY(100%); }
  30% { transform: translateY(50%); }
  60% { transform: translateY(60%); }
  70% { transform: translateY(10%)}
  80% { transform: translateY(20%)}
  85% { transform: translateY(100%); }
  100% { transform: translateY(100%); }
`;

const Heino = styled.img`
  width: 20vw;
  position: fixed;
  bottom: 0;
  right: 5vw;
  transform: translateY(100%);
  animation: ${peekAnimation} 10s 3s ease infinite;
`;

function HeinoPeeker() {
  return (
    <Wrapper>
      <Heino src={`${process.env.PUBLIC_URL}/assets/letsDrink/heino.svg`} />
    </Wrapper>
  );
}

export default HeinoPeeker;
