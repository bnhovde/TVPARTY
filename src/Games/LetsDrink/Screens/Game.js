import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Howl } from 'howler';

// Helpers
import {
  items,
  sabotagedItems,
  sliceDegree,
} from './../constants/spinnerItems';
import { delay } from './../../../utilities/helpers';

// Components
import { FullScreen, SunburstScreen } from './../../../Primitives/Screen';
import HeaderBar from './../../../Components/HeaderBar';
import Message from './../../../Components/Message';
import Block from './../../../Primitives/Block';
import HeinoFull from './../Components/HeinoFull';
import Spinner from './../Components/Spinner';
import PlayerScores from './../Components/PlayerScores';

class GameScreen extends Component {
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
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/medley.mp3`],
        loop: true,
      }),
      spinSound: new Howl({
        src: [
          `${process.env.PUBLIC_URL}/assets/letsDrink/sounds/wheel-spin.wav`,
        ],
      }),
      cheer: new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/cheer.wav`],
      }),
      scream: new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/scream.wav`],
      }),
      whistle: new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/whistle.wav`],
      }),
      beerSound: new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/beer.m4a`],
      }),
      beerOpenSound: new Howl({
        src: [
          `${process.env.PUBLIC_URL}/assets/letsDrink/sounds/beer-open.wav`,
        ],
      }),
      cashSound: new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/letsDrink/sounds/cash.wav`],
      }),
    };
    this.sounds.cheer.play();
    this.sounds.themeSong.play();

    // Socket events
    this.props.socket.on('event', data => {
      // Spin event
      if (data.type === 'spin') {
        this.spin();
      }

      // Sabotage event
      if (data.type === 'sabotage') {
        this.handleSabotage(data.details);
      }

      // Buy suit event
      if (data.type === 'buySuit') {
        this.handleBuySuit(data.details);
      }

      // Chat message
      if (data.type === 'speak') {
        // Fade the song, then speak
        this.fadeThenSpeak(data.message);
      }
    });

    (async () => {
      await delay(3000);
      // Set current player
      this.nextPlayer();
    })();
  }

  componentWillUnmount() {
    // Stop all sounds
    this.sounds.themeSong.stop();

    // Remove event listeners
    this.props.socket.off('event');
  }

  handleSabotage(details) {
    // Someone has been sabotaged!
    const targetPlayerId = details.targetId;
    const targetPlayerData = this.props.gameData.players[targetPlayerId];
    const sendingPlayerId = details.sendingId;
    const sendingPlayerData = this.props.gameData.players[sendingPlayerId];

    // Set target as sabotaged
    this.props.updatePlayerData(this.props.gameData.gameCode, targetPlayerId, {
      ...targetPlayerData,
      isSabotaged: true,
    });

    // Take points off sabotaging player
    const currentPoints = sendingPlayerData.points || 0;
    this.props.updatePlayerData(this.props.gameData.gameCode, sendingPlayerId, {
      ...sendingPlayerData,
      points: currentPoints - 50,
    });

    // Play sound
    this.sounds.scream.play();
  }

  handleBuySuit(details) {
    // Someone has bought the heino suit
    const sendingPlayerId = details.sendingId;
    const sendingPlayerData = this.props.gameData.players[sendingPlayerId];

    // Award suit and take off points
    const currentPoints = sendingPlayerData.points || 0;
    this.props.updatePlayerData(this.props.gameData.gameCode, sendingPlayerId, {
      ...sendingPlayerData,
      points: currentPoints - 200,
    });

    // Play sound
    this.sounds.whistle.play();

    (async () => {
      await delay(1000);
      this.props.updateGameData(this.props.gameData.gameCode, {
        ...this.props.gameData,
        winningPlayerId: sendingPlayerId,
        screen: 'gameOver',
      });
    })();
  }

  fadeThenSpeak(message) {
    this.sounds.themeSong.fade(1, 0.2, 500);
    this.sounds.themeSong.once('fade', () => {
      this.props.speak(message);
      setTimeout(() => {
        this.sounds.themeSong.fade(0.2, 1, 500);
      }, 3000);
    });
  }

  // Change player turn
  nextPlayer() {
    const currentPlayer = this.props.gameData.playersTurn;
    const playerKeys = Object.keys(this.props.gameData.players);
    const current = playerKeys.indexOf(currentPlayer);
    const nextIndex = playerKeys[current + 1]
      ? playerKeys[current + 1]
      : playerKeys[0];
    this.props.updateGameData(this.props.gameData.gameCode, {
      ...this.props.gameData,
      playersTurn: nextIndex,
    });
  }

  notify(message) {
    (async () => {
      this.setState({
        alertData: {
          visible: true,
          message,
        },
      });
      await delay(3000);
      this.setState({
        alertData: {},
      });
    })();
  }

  awardPrize(prize) {
    let sound;
    let points = false;
    let drinks = false;
    let shades = false;
    let hair = false;
    let prizeText = '';
    switch (prize) {
      case '5p':
        sound = 'cashSound';
        points = 5;
        prizeText = '5 points';
        break;
      case '25p':
        sound = 'cashSound';
        points = 25;
        prizeText = '25 points';
        break;
      case '100p':
        sound = 'cashSound';
        points = 100;
        prizeText = '100 points';
        break;
      case 'beerx1':
        sound = 'beerOpenSound';
        drinks = 1;
        prizeText = '1 beer';
        break;
      case 'beerx5':
        sound = 'beerSound';
        drinks = 5;
        prizeText = '5 beers';
        break;
      case 'hair':
        hair = true;
        prizeText = 'the Heino hair';
        sound = 'cheer';
        break;
      case 'shades':
        shades = true;
        prizeText = 'the Heino shades';
        sound = 'cheer';
        break;
      default:
        sound = 'beerOpenSound';
    }
    this.sounds[sound].play();

    // Award prize
    const { players, playersTurn } = this.props.gameData;
    const player = players[playersTurn];
    this.notify(`${player.name} wins ${prizeText}`);

    if (points) {
      const currentPoints = player.points || 0;
      this.props.updatePlayerData(this.props.gameData.gameCode, playersTurn, {
        ...player,
        points: currentPoints + points,
      });
    }

    if (drinks) {
      const currentDrinks = player.drinks || 0;
      this.props.updatePlayerData(this.props.gameData.gameCode, playersTurn, {
        ...player,
        drinks: currentDrinks + drinks,
      });
    }

    if (shades) {
      this.props.updateGameData(this.props.gameData.gameCode, {
        ...this.props.gameData,
        playerWithShades: playersTurn,
      });
      (async () => {
        await delay(1000);
        this.fadeThenSpeak(`${player.name} gets the heino shades! Himalaya!`);
      })();
    }

    if (hair) {
      this.props.updateGameData(this.props.gameData.gameCode, {
        ...this.props.gameData,
        playerWithHair: playersTurn,
      });
      (async () => {
        await delay(1000);
        this.fadeThenSpeak(
          `${player.name} gets the heino hair! Nice and cool!`,
        );
      })();
    }

    // Remove any temporary modifiers
    (async () => {
      await delay(5000);
      this.resetModifiers(playersTurn);
    })();
  }

  resetModifiers(playerId) {
    const { players } = this.props.gameData;
    const player = players[playerId];
    this.props.updatePlayerData(this.props.gameData.gameCode, playerId, {
      ...player,
      isSabotaged: false,
    });
  }

  spin() {
    this.setState({ isSpinning: true });
    this.sounds.spinSound.play();
    const randomDegree = Math.floor(Math.random() * (3000 - (300 + 1))) + 300;
    this.props.updateGameData(this.props.gameData.gameCode, {
      ...this.props.gameData,
      spinRotation: randomDegree,
    });

    // Determine prize
    let degree = randomDegree;
    while (degree > 360) {
      degree -= 360;
    }
    const prizeIndex = Math.round(degree / sliceDegree) + 1;
    const index = prizeIndex === 17 ? 15 : prizeIndex;

    // Check if player is sabotaged
    const { isSabotaged } = this.props.gameData.players[
      this.props.gameData.playersTurn
    ];
    const itemsToUse = isSabotaged ? sabotagedItems : items;
    const prize = itemsToUse[items.length - index];

    // Stop heino animation
    (async () => {
      await delay(1000);
      this.setState({ isSpinning: false });
    })();

    // Notify user of prize
    (async () => {
      await delay(3200);
      this.awardPrize(prize);
    })();

    // Change player
    (async () => {
      await delay(4200);
      this.nextPlayer(prize);
    })();
  }

  render() {
    const {
      players = {},
      gameCode = '',
      spinRotation,
      playersTurn,
      playerWithShades,
      playerWithHair,
    } = this.props.gameData;
    const { alertData, isSpinning } = this.state;
    return (
      <FullScreen>
        <SunburstScreen />
        <HeaderBar
          title="Let's drink!"
          subTitle="TVPARTY presents"
          gameCode={gameCode}
        />
        <Block>
          <Message data={alertData} />
          <PlayerScores
            players={players}
            playersTurn={playersTurn}
            playerWithShades={playerWithShades}
            playerWithHair={playerWithHair}
          />
          <Spinner
            rotation={spinRotation}
            useSabotaged={
              players[playersTurn] && players[playersTurn].isSabotaged
            }
          />
          <HeinoFull
            isSpinning={isSpinning}
            isInLove={
              playersTurn === playerWithShades || playersTurn === playerWithHair
            }
          />
        </Block>
      </FullScreen>
    );
  }
}

export default GameScreen;
