import styled, { keyframes } from 'styled-components';

import variables from './../constants/variables';

const { colors, gutter } = variables;

const rainbow = keyframes`
0% {
  background-position: 96% 0%;
}
50% {
  background-position: 5% 100%;
}
100% {
  background-position: 96% 0%;
}
`;

const rotate = keyframes`
  0% { transform: rotate(0) scale(4); }
  100% { transform: rotate(360deg) scale(4); }
`;

const FullScreen = styled.section`
  display: block;
  padding: ${gutter.vertical}vh ${gutter.horizontal}vw;
  background: ${colors.primary};
  min-height: 100vh;
`;

const Screen = styled.section`
  display: block;
  padding: ${gutter.horizontal}vw;
`;

const AnimatedScreen = styled.section`
  display: block;
  padding: ${gutter.horizontal}vw;
  background: linear-gradient(
    223deg,
    #3fa7d6,
    #59cd90,
    #fac05e,
    #f79d84,
    #ee6352
  );
  background-size: 1000% 1000%;

  animation: ${rainbow} 30s ease infinite;
`;

const SunburstScreen = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url("${process.env
    .PUBLIC_URL}/assets/letsDrink/sunburst.svg");
  background-size: cover;
  background-position: center;
  animation: ${rotate} 50s linear infinite;
  opacity: 0.03;
`;

export { Screen, FullScreen, AnimatedScreen, SunburstScreen };
