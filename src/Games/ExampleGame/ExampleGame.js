import React, { Component } from 'react';
import autoBind from 'react-autobind';

// Components
import { Screen } from './../../Primitives/Screen';
import { H1, H2 } from './../../Primitives/H';
import Block from './../../Primitives/Block';

class ExampleGame extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {};
  }
  render() {
    return (
      <Screen>
        <H1>ExampleGame!</H1>
        <p>Game code: {this.props.gameData.code}</p>
        <Block top={1}>
          <H2>Connected players:</H2>
        </Block>
      </Screen>
    );
  }
}

export default ExampleGame;
