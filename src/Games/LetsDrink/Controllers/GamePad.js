import React, { Component } from 'react';
import autoBind from 'react-autobind';
import styled from 'styled-components';
import { Howl } from 'howler';

// Helpers
import { delay } from './../../../utilities/helpers';

// Components
import { FullScreen } from './../../../Primitives/Screen';
import JoinGameForm from './../../../Components/JoinGameForm';
import ChatForm from './../../../Components/ChatForm';
import ShopForm from './../Components/ShopForm';
import Drawer from './../../../Components/Drawer';
import { H1, H2 } from './../../../Primitives/H';
import { Button } from './../../../Primitives/Button';
import Block from './../../../Primitives/Block';
import { LargeText } from '../../../Primitives/Text';

const Avatar = styled.img`
  display: block;
  width: 20vw;
  max-width: 200px;
  margin: 0 auto;
`;

class GamePad extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      chatDrawerOpen: false,
      shopDrawerOpen: false,
      fields: {
        disableSpin: false,
        userName: '',
      },
    };
  }

  componentDidMount() {
    // Define sounds
    this.sounds = {
      buy: new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/buy.wav`],
      }),
    };
  }

  handleChange(key, value) {
    this.setState({
      fields: Object.assign({}, this.state.fields, {
        [key]: value,
      }),
    });
  }

  handleStartGame() {
    this.props.sendEvent({
      type: 'start',
    });
  }

  handleToggleChat() {
    this.setState({
      chatDrawerOpen: !this.state.chatDrawerOpen,
    });
  }

  handleToggleShop() {
    this.setState({
      shopDrawerOpen: !this.state.shopDrawerOpen,
    });
  }

  handleSabotagePlayer(targetId) {
    this.props.sendEvent({
      type: 'sabotage',
      details: {
        targetId,
        sendingId: this.props.currentPlayerId,
      },
    });
    this.sounds.buy.play();
  }

  handleBuySuit() {
    this.props.sendEvent({
      type: 'buySuit',
      details: {
        sendingId: this.props.currentPlayerId,
      },
    });
    this.sounds.buy.play();
    this.setState({
      shopDrawerOpen: false,
    });
  }

  handleSpin() {
    // Prevent multiple events sent
    this.setState({
      disableSpin: true,
    });
    this.props.sendEvent({
      type: 'spin',
    });
    (async () => {
      await delay(10000);
      this.setState({
        disableSpin: false,
      });
    })();
  }

  handleSendMessage(e) {
    e.preventDefault();
    this.props.sendEvent({
      type: 'speak',
      message: `${this.props.currentPlayer.name} says ${this.state.fields
        .chatMessage}`,
    });
    this.setState({
      fields: Object.assign({}, this.state.fields, {
        chatMessage: '',
      }),
    });
  }

  findAvatar() {
    const { playerWithHair, playerWithShades } = this.props.gameData;

    let avatar = 'face';
    if (playerWithHair === this.props.currentPlayerId) {
      avatar = 'face-hair';
    }
    if (playerWithShades === this.props.currentPlayerId) {
      avatar = 'face-shades';
    }
    if (
      playerWithHair === this.props.currentPlayerId &&
      playerWithShades === this.props.currentPlayerId
    ) {
      avatar = 'face-shades-hair';
    }
    return avatar;
  }

  checkIfCanBuySuit() {
    const { playerWithHair, playerWithShades } = this.props.gameData;

    return (
      playerWithHair === this.props.currentPlayerId &&
      playerWithShades === this.props.currentPlayerId
    );
  }

  render() {
    const { playerName, chatMessage } = this.state.fields;
    const { selectedPlayerForSabotage } = this.state;
    const {
      currentPlayer,
      currentPlayerId,
      playerLoaded,
      onAddPlayer,
    } = this.props;

    const {
      screen = 'splash',
      playersTurn,
      players = {},
      playerWithHair,
      playerWithShades,
      winningPlayerId,
    } = this.props.gameData;

    const player = players[currentPlayerId] || {};
    const waitingForPlayer = players[playersTurn] || {};
    const winningPlayer = players[winningPlayerId] || {};

    return (
      <FullScreen>
        {playerLoaded ? (
          <div>
            <H1>Hi, {currentPlayer.name}!</H1>
            {screen === 'splash' && (
              <div>
                <Block top={2}>
                  <p>Wait for other players to connect, then click start!</p>
                </Block>
                <Block top={1}>
                  <Button onClick={this.handleStartGame}>Start game!</Button>
                </Block>
              </div>
            )}
            {screen === 'game' && (
              <div>
                <Block top={1}>
                  <Avatar
                    src={`${process.env
                      .PUBLIC_URL}/assets/letsDrink/${this.findAvatar()}.svg`}
                  />
                </Block>
                <Block top={1}>
                  <p>Your cash: {player.points || 0}</p>
                </Block>
                <Block top={0.5}>
                  <p>You've won {player.drinks || 0} drinks</p>
                </Block>
                <Block top={1}>
                  {currentPlayerId === playersTurn ? (
                    <Button
                      onClick={this.handleSpin}
                      disabled={this.state.disableSpin}
                    >
                      Spin!
                    </Button>
                  ) : (
                    <Button disabled>
                      Waiting for {waitingForPlayer.name}
                    </Button>
                  )}
                </Block>
                <Block top={1}>
                  <Button
                    disabled={
                      currentPlayerId !== playersTurn || this.state.disableSpin
                    }
                    onClick={this.handleToggleShop}
                  >
                    Shop
                  </Button>
                </Block>
                <Block top={1}>
                  <Button onClick={this.handleToggleChat}>Chat</Button>
                </Block>
              </div>
            )}

            {screen === 'gameOver' && (
              <div>
                <Block top={2}>
                  <p>Game over!</p>
                </Block>
                <Block top={1}>
                  {currentPlayerId === winningPlayerId ? (
                    <LargeText>You Won!!!</LargeText>
                  ) : (
                    <H2>{winningPlayer.name} won the game!</H2>
                  )}
                </Block>
              </div>
            )}

            <Drawer visible={this.state.chatDrawerOpen}>
              <Block top={1} left={1} right={1}>
                <H1>Chat</H1>
              </Block>
              <Block top={1} left={1} right={1}>
                <ChatForm
                  chatMessage={chatMessage}
                  onChange={this.handleChange}
                  onSubmit={this.handleSendMessage}
                />
              </Block>
              <Block top={1} left={1} right={1}>
                <Button onClick={this.handleToggleChat}>Close chat</Button>
              </Block>
            </Drawer>

            <Drawer visible={this.state.shopDrawerOpen}>
              <Block top={1} left={1} right={1}>
                <H1>Shop</H1>
              </Block>
              <Block top={1} left={1} right={1}>
                <ShopForm
                  points={player.points || 0}
                  onShop={this.handleSendMessage}
                  players={players}
                  canBuySuit={this.checkIfCanBuySuit()}
                  currentPlayerId={currentPlayerId}
                  onSabotagePlayer={this.handleSabotagePlayer}
                  onBuySuit={this.handleBuySuit}
                />
              </Block>
              <Block top={1} left={1} right={1} bottom={1}>
                <Button onClick={this.handleToggleShop}>Close shop</Button>
              </Block>
            </Drawer>
          </div>
        ) : (
          <JoinGameForm
            playerName={playerName}
            onChange={this.handleChange}
            onSubmit={e => onAddPlayer(e, playerName)}
          />
        )}
      </FullScreen>
    );
  }
}

export default GamePad;
