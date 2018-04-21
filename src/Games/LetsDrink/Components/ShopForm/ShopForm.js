import React, { Component } from 'react';
import autoBind from 'react-autobind';
import styled from 'styled-components';
import { firstObjKey } from '../../../../utilities/helpers';

import Select from '../../../../Components/Select';
import { Button } from '../../../../Primitives/Button';
import { Screen } from './../../../../Primitives/Screen';
import { Text, TextBlack } from './../../../../Primitives/Text';
import Block from './../../../../Primitives/Block';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #dedede;
  color: white;
  will-change: top;
  z-index: 5;
`;

class ShopForm extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      selectedPlayerForSabotage: false,
    };
  }

  handleChangeSabotagePlayer(target, value) {
    this.setState({
      selectedPlayerForSabotage: value,
    });
  }

  handleSabotagePlayer() {
    const target =
      this.state.selectedPlayerForSabotage || firstObjKey(this.props.players);
    this.props.onSabotagePlayer(target);
  }

  render() {
    const {
      points = 0,
      players,
      currentPlayerId,
      onBuySuit,
      canBuySuit,
    } = this.props;

    const playerItems = Object.keys(players).map(id => {
      return {
        id,
        name: players[id].name,
      };
    });

    return (
      <div>
        <Text>You have {points} points</Text>
        <Block top={1}>
          <Wrapper>
            <Screen>
              <Block>
                <TextBlack>Sabotage player (50 points)</TextBlack>
              </Block>
              <Block top={0.5}>
                <Select
                  name="sabotageSelect"
                  items={playerItems}
                  onChange={this.handleChangeSabotagePlayer}
                  selected={this.state.selectedPlayerForSabotage}
                />
              </Block>
              <Block top={0.5}>
                <Button
                  onClick={this.handleSabotagePlayer}
                  disabled={points < 50}
                >
                  Sabotage player
                </Button>
              </Block>
            </Screen>
          </Wrapper>
        </Block>
        <Block top={0.5}>
          <Wrapper>
            <Screen>
              <Block>
                <TextBlack>Heino suit (200 points)</TextBlack>
                <TextBlack>(requires shades &amp; hair)</TextBlack>
              </Block>
              <Block top={0.5}>
                <Button
                  onClick={onBuySuit}
                  disabled={points < 10 || !canBuySuit}
                >
                  Buy the suit
                </Button>
              </Block>
            </Screen>
          </Wrapper>
        </Block>
      </div>
    );
  }
}

export default ShopForm;
