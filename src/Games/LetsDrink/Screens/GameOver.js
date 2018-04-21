import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Howl } from 'howler';

// Helpers
import { delay } from './../../../utilities/helpers';

// Components
import { FullScreen, SunburstScreen } from './../../../Primitives/Screen';
import HeaderBar from './../../../Components/HeaderBar';
import Message from './../../../Components/Message';
import Block from './../../../Primitives/Block';
import HeinoFull from './../Components/HeinoFull';
import HeinoWinner from './../Components/HeinoWinner';
import PlayerScores from './../Components/PlayerScores';

class GameOverScreen extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      isSpinning: false,
      alertData: {
        visible: false,
        message: '',
      },
    };
  }

  componentDidMount() {
    // Define sounds
    this.sounds = {
      themeSong: new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/medley-2.mp3`],
        loop: true,
      }),
      cheer: new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/cheer.wav`],
      }),
    };
    this.sounds.cheer.play();
    this.sounds.themeSong.play();

    (async () => {
      await delay(2000);
      this.sounds.themeSong.fade(1, 0.2, 500);
      this.sounds.themeSong.once('fade', () => {
        const { winningPlayerId, players } = this.props.gameData;
        const winner = players[winningPlayerId] || {};
        this.props.speak(
          `${winner.name} has become heino, nice, tight, himalaya!`,
        );
        setTimeout(() => {
          this.sounds.themeSong.fade(0.2, 1, 500);
        }, 3000);
      });
    })();
  }

  componentWillUnmount() {
    // Stop all sounds
    this.sounds.themeSong.stop();

    // Remove event listeners
    this.props.socket.off('event');
  }

  render() {
    const {
      players = {},
      gameCode = '',
      playerWithShades,
      playerWithHair,
      winningPlayerId,
    } = this.props.gameData;
    const { alertData, isSpinning } = this.state;
    const winner = players[winningPlayerId] || {};
    return (
      <FullScreen>
        <SunburstScreen />
        <HeaderBar
          title="Game over!"
          subTitle="And the winner is.."
          gameCode={gameCode}
        />
        <Block>
          <Message data={alertData} />
          <PlayerScores
            players={players}
            playerWithShades={playerWithShades}
            playerWithHair={playerWithHair}
          />
          <HeinoWinner winner={winner} />
          <HeinoFull isSpinning={isSpinning} isInLove />
        </Block>
      </FullScreen>
    );
  }
}

export default GameOverScreen;
