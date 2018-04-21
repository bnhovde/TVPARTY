import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Howl } from 'howler';

// Components
import { FullScreen, SunburstScreen } from './../../../Primitives/Screen';
import HeaderBar from './../../../Components/HeaderBar';
import { H2 } from './../../../Primitives/H';
import Block from './../../../Primitives/Block';
import { TextBold } from './../../../Primitives/Text';
import HeinoPeeker from './../Components/HeinoPeeker';
import SpinningBeer from './../Components/SpinningBeer';

// TEMP
const greetings = ['Sweet!', 'himalaya', 'oh dear'];

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {};
  }

  componentDidMount() {
    // Play theme song
    this.themeSong = new Howl({
      src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/medley.mp3`],
      loop: true,
    });
    this.themeSong.play();

    this.props.socket.on('event', data => {
      if (data.type === 'speak') {
        // Fade the song, then speak
        this.themeSong.fade(1, 0.2, 500);
        this.themeSong.once('fade', () => {
          this.props.speak(data.message);
          setTimeout(() => {
            this.themeSong.fade(0.2, 1, 500);
          }, 3000);
        });
      }
      if (data.type === 'greetPlayer') {
        const randomGreeting =
          greetings[Math.floor(Math.random() * greetings.length)];
        // Fade the song, then speak
        this.themeSong.fade(1, 0.2, 500);
        this.themeSong.once('fade', () => {
          this.props.speak(
            `${data.name} has joined the game! ${randomGreeting}`,
          );
          setTimeout(() => {
            this.themeSong.fade(0.2, 1, 500);
          }, 2000);
        });
      }
    });
  }

  componentWillUnmount() {
    // Stop all sounds
    this.themeSong.stop();

    // Remove event listeners
    this.props.socket.off('event');
  }

  render() {
    const { players = {}, gameCode = '' } = this.props.gameData;
    return (
      <FullScreen>
        <SunburstScreen />
        <HeaderBar
          title="Let's Drink!"
          subTitle="Score points and become Heino"
          gameCode={gameCode}
        />
        <Block top={1}>
          <H2>Connected players:</H2>
        </Block>
        <Block top={0.5}>
          {Object.keys(players)
            .filter(p => !players[p].inactive)
            .map(p => (
              <div key={p}>
                <TextBold>{players[p].name}</TextBold>
              </div>
            ))}
        </Block>
        <SpinningBeer />
        <HeinoPeeker />
      </FullScreen>
    );
  }
}

export default SplashScreen;
