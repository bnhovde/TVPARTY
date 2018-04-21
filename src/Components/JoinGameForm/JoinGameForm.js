import React from 'react';
import styled from 'styled-components';

import { H1 } from '../../Primitives/H';
import { Input } from '../../Primitives/Input';
import { Button } from '../../Primitives/Button';
import { FullScreen } from './../../Primitives/Screen';
import Block from './../../Primitives/Block';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: white;
  will-change: top;
  z-index: 5;
`;

function JoinGameForm(props) {
  const { playerName = '', onSubmit, onChange } = props;

  return (
    <Form onSubmit={onSubmit}>
      <H1>Join the game</H1>
      <Block top={2}>
        <Input
          required
          placeholder="Enter name"
          value={playerName}
          onChange={({ target }) => {
            onChange('playerName', target.value);
          }}
        />
      </Block>
      <Block top={1}>
        <Button type="submit" disabled={!playerName}>
          Join Game!
        </Button>
      </Block>
    </Form>
  );
}

export default JoinGameForm;
