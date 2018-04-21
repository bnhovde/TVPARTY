/**
*
* Loader
*
*
*/
import React from 'react';
import styled, { keyframes } from 'styled-components';

const armMove = keyframes`
  0% { transform: rotate(-109deg); }
  10% { transform: rotate(0deg) translateY(-5px)}
  20% { transform: rotate(15deg) translateY(-10px)}
  80% { transform: rotate(-120deg) translateY(10px); }
  100% { transform: rotate(-120deg) translateY(10px); }
`;

const heinoMove = keyframes`
  0% { transform: rotate(0); }
  15% { transform: rotate(3deg)}
  70% { transform: rotate(-3deg)}
  100% { transform: rotate(0deg)}
`;

const heartBeat = keyframes`
  0%{
    transform: scale(0.90) translateY(0);
  }
  50%{
    transform: scale(1) translateY(10px);
  }
  100%{
    transform: scale(0.90) translateY(0);
  }
`;

const Wrapper = styled.div`
  position: fixed;
  right: 5%;
  bottom: 0;
  height: 50%;
  width: 20%;
`;

const Heino = styled.img`
  height: 100%;
  display: block;
  animation: ${props => props.isSpinning && `${heinoMove} 1s ease infinite`};
  transform-origin: bottom center;
`;

const HeinoArm = styled.img`
  position: absolute;
  height: 40%;
  display: block;
  top: 61%;
`;

const Heart = styled.img`
  position: absolute;
  width: 3vw;
  display: block;
  top: -18%;
  left: 28%;
  animation: ${heartBeat} 3s ease infinite;
`;

const HeinoArmCurved = styled.img`
  position: absolute;
  height: 60%;
  display: block;
  top: 5%;
  right: 87%;
  transform-origin: bottom right;
  animation: ${armMove} 1s ease-out infinite;
`;

function HeinoFull(props) {
  return (
    <Wrapper>
      <Heino
        isSpinning={props.isSpinning}
        src={`${process.env.PUBLIC_URL}/assets/letsDrink/heino-large.svg`}
      />
      {props.isInLove && (
        <Heart src={`${process.env.PUBLIC_URL}/assets/letsDrink/heart.svg`} />
      )}
      {props.isSpinning ? (
        <HeinoArmCurved
          src={`${process.env.PUBLIC_URL}/assets/letsDrink/hand-curved.svg`}
        />
      ) : (
        <HeinoArm
          src={`${process.env.PUBLIC_URL}/assets/letsDrink/hand-straight.svg`}
        />
      )}
    </Wrapper>
  );
}

export default HeinoFull;
