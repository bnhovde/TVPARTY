import React from 'react';

import styled from 'styled-components';
import variables from './../../constants/variables';

const { gutter, colors } = variables;

const Wrapper = styled.div`
  position: relative;
  display: block;
  background: ${colors.bg};
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  right: ${gutter.horizontal}vw;
  color: black;
  transform: translateY(-50%);
`;

const SelectEl = styled.select`
  width: 100%;
  line-height: 3rem;
  padding: 0 ${gutter.horizontal}vw;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 0;
  border-radius: 0;
  color: black;
  -webkit-appearance: none;
`;

function Select(props) {
  const { name, items, selected, onChange } = props;

  return (
    <Wrapper>
      <Arrow>&darr;</Arrow>
      <SelectEl
        value={selected}
        name={name}
        onChange={({ target }) => {
          onChange(name, target.value);
        }}
      >
        {items.filter(option => !option.disabled).map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </SelectEl>
    </Wrapper>
  );
}

export default Select;
