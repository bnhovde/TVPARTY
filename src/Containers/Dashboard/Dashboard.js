import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import styled from 'styled-components';

// Redux
import { speak } from './../../store/audio';
import { create } from './../../store/games';

// Helpers
import { generateGameCode } from './../../utilities/helpers';
import games from './../../Games/games';

// Components
import { Input } from '../../Primitives/Input';
import { Text, LargeText } from '../../Primitives/Text';
import HeaderBar from './../../Components/HeaderBar';
import Toggle from './../../Components/Toggle';
import { Button, InlineButton } from './../../Primitives/Button';
import Form from './../../Primitives/Form';
import Block from './../../Primitives/Block';
import { DesktopView, MobileView } from './../../Primitives/View';
import { FullScreen, SunburstScreen } from './../../Primitives/Screen';

const FlexGrid = styled.div`
  position: relative;
  display: flex;
  height: 75vh;
  justify-content: space-around;
  flex-direction: column;
`;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      fields: {
        gameType: games[0].id,
        gameCode: '',
      },
    };
  }

  handleJoinGame() {
    const { gameCode } = this.state.fields;
    this.props.joinGame(gameCode);
  }

  startNewGame() {
    const gameData = {
      gameType: this.state.fields.gameType,
      gameCode: generateGameCode(),
      created: Date.now(),
      data: {},
    };
    this.props.createGame(gameData).then(() => {
      this.props.hostGame(gameData.gameCode);
    });
  }

  handleChange(key, value) {
    this.setState({
      fields: Object.assign({}, this.state.fields, {
        [key]: value,
      }),
    });
  }

  render() {
    const { gameCode, gameType } = this.state.fields;

    return (
      <FullScreen>
        <SunburstScreen />
        <HeaderBar
          title="TVPARTY"
          subTitle="Join the party at tvparty.io"
          centered
        />

        <FlexGrid>
          <MobileView>
            <Block top={2} align="center">
              <LargeText>Join a game</LargeText>
              <Form onSubmit={this.handleJoinGame} transparent>
                <Block top={1} left={0.5} right={0.5}>
                  <Input
                    required
                    centered
                    placeholder="ABCD"
                    value={gameCode}
                    onChange={({ target }) => {
                      this.handleChange('gameCode', target.value.toUpperCase());
                    }}
                  />
                </Block>
                <Block top={0.5} bottom={0.5} left={0.5} right={0.5}>
                  <Button type="submit" disabled={gameCode.length !== 4}>
                    Enter
                  </Button>
                </Block>
              </Form>
            </Block>
          </MobileView>

          <DesktopView>
            <Block top={2}>
              <Toggle
                name="gameType"
                items={games}
                selected={gameType}
                onChange={this.handleChange}
              />
            </Block>

            <Block top={2} align="center">
              <InlineButton onClick={() => this.startNewGame()}>
                Start new game
              </InlineButton>
            </Block>
          </DesktopView>
          <div>
            <Block top={1} align="center">
              <Text>BETA VERSION</Text>
            </Block>
          </div>
        </FlexGrid>
      </FullScreen>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createGame: gameData => dispatch(create(gameData)),
    hostGame: gameCode => dispatch(push(`/host/${gameCode}`)),
    joinGame: gameCode => dispatch(push(`/${gameCode}`)),
    welcomeMessage: name =>
      dispatch(speak(`${name} has joined the game! Tight!`)),
  };
}

export default connect(null, mapDispatchToProps)(Dashboard);
