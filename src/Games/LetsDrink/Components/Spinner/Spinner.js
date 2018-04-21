/**
*
* Loader
*
*
*/
import React from 'react';
import styled, { keyframes } from 'styled-components';

import {
  items,
  sabotagedItems,
  sliceDegree,
} from './../../constants/spinnerItems';

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  transform: translateX(-50%) translateY(-40%);
  width: 40%;
  left: 50%;
`;

const InnerWrapper = styled.div`
  transition: transform 3s ease-out;
`;

const Indicator = styled.img`
  display: block;
  position: absolute;
  width: 10%;
  top: -3%;
  left: 50%;
  z-index: 1;
  transform: translateX(-50%);
`;

const Circle = styled.img`
  display: block;
  width: 100%;
`;

const Icon = styled.img`
  width: 100%;
  margin-top: 15px;
`;

const Slice = styled.div`
  position: absolute;
  left: 50%;
  width: 10%;
  height: 50%;
  transform: translateX(-50%) rotate(${props => props.rotation}deg);
  transform-origin: bottom center;
}
`;

function Spinner(props) {
  const { rotation = 0, useSabotaged = false } = props;
  const currentItems = useSabotaged ? sabotagedItems : items;
  return (
    <Wrapper>
      <Indicator src={`${process.env.PUBLIC_URL}/assets/letsDrink/arrow.svg`} />
      <InnerWrapper style={{ transform: `rotate(${rotation}deg)` }}>
        {currentItems.map((item, i) => (
          <Slice key={i} rotation={sliceDegree * (i + 1)}>
            <Icon
              src={`${process.env.PUBLIC_URL}/assets/letsDrink/${item}.svg`}
            />
          </Slice>
        ))}
        <Circle src={`${process.env.PUBLIC_URL}/assets/letsDrink/wheel.svg`} />
      </InnerWrapper>
    </Wrapper>
  );
}

export default Spinner;
