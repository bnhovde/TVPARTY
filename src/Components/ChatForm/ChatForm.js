import React from 'react';
import styled from 'styled-components';

import { Input } from '../../Primitives/Input';
import { Button } from '../../Primitives/Button';
import { Screen } from './../../Primitives/Screen';
import Block from './../../Primitives/Block';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #dedede;
  color: white;
  will-change: top;
  z-index: 5;
`;

function ChatForm(props) {
  const { chatMessage = '', onSubmit, onChange } = props;

  return (
    <Form onSubmit={onSubmit}>
      <Screen>
        <Block>
          <Input
            required
            placeholder="Enter chat message"
            value={chatMessage}
            onChange={({ target }) => {
              onChange('chatMessage', target.value);
            }}
          />
        </Block>
        <Block top={1}>
          <Button type="submit">Send message</Button>
        </Block>
      </Screen>
    </Form>
  );
}

export default ChatForm;
