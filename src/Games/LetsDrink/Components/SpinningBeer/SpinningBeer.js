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

const rotateAnimation = keyframes`
  0% { transform: translateY(-50%) translateX(-50%) rotate(0deg); }
  100% { transform: translateY(-50%) translateX(-50%) rotate(360deg); }
`;

const Beer = styled.img`
  width: 10vw;
  position: fixed;
  top: 50%;
  left: 50%;
  animation: ${rotateAnimation} 3s linear infinite;
`;

function SpinningBeer() {
  return (
    <Wrapper>
      <Beer src={`${process.env.PUBLIC_URL}/assets/letsDrink/beer.svg`} />
    </Wrapper>
  );
}

export default SpinningBeer;
