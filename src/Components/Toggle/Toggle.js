import React from 'react';

import styled from 'styled-components';
import variables from './../../constants/variables';

const { gutter, fontSizes } = variables;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const ToggleButton = styled.button`
  display: block;
  margin: 0 ${gutter.horizontal / 2}vw;
  cursor: pointer;
  border: 0;
  padding: 0;
  text-transform: uppercase;
  opacity: ${props => (props.active ? '1' : '0.2')};
  transition: opacity 0.3s ease;
`;

const Image = styled.img`
  display: block;
  width: 15vw;
  border-radius: 50%;
  margin-bottom: ${gutter.vertical / 4}vw;
`;

function Toggle(props) {
  const { name, items, selected, onChange } = props;

  return (
    <Wrapper id={`${name}-toggle`}>
      {items.map(item => (
        <ToggleButton
          key={item.id}
          active={item.id === selected}
          onClick={() => {
            onChange(name, item.id);
          }}
        >
          <Image
            alt={item.name}
            src={`${process.env.PUBLIC_URL}/assets/${item.assets}/${item.logo}`}
          />
          <span>{item.name}</span>
        </ToggleButton>
      ))}
    </Wrapper>
  );
}

export default Toggle;
