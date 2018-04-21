import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './KarambaKaracho.css';
import GamePad from "./GamePad";
import GameScreen from "./GameScreen";
import { Howl } from 'howler';
import StartScreen from "./StartScreen";

class KarambaKaracho extends Component {
  constructor(props) {
    super(props);
    this.handleAddPlayer = this.handleAddPlayer.bind(this);
    this.allPlayersReady = this.allPlayersReady.bind(this);

    this.state = {
      allPlayersReady: false,
      gameData: null,
    };

    if(props.isHost) {
      new Howl({
        src: [`${process.env.PUBLIC_URL}/assets/karambaKaracho/karambakaracho.ogg`],
        loop: true,
      }).play();
    }
  }

  componentDidMount() {
    const {
      isHost,
      gameData,
    } = this.props;
  }

  handleAddPlayer(e, playerName) {
    e.preventDefault();
    this.props.addPlayer(this.props.gameData.gameCode, {
      name: playerName || 'Unknown player',
    });
    this.props.sendEvent({
      type: 'greetPlayer',
      name: playerName,
    });
  }

  componentWillReceiveProps(newProps) {
    const {
      gameData,
      isHost
    } = newProps;
  }

  allPlayersReady() {
    this.setState({
      allPlayersReady: true,
    })
  }

  render() {
    const {
      isHost
    } = this.props;

    if (isHost) {
      if (!this.state.allPlayersReady) {
        return (
            <StartScreen
                handlePlayersReady={this.allPlayersReady}
                gameData={this.props.gameData}
                socket={this.props.socket}
            />
        );
      }
      else {
        return <GameScreen {...this.props}/>;
      }
    }
    else {
      return (
          <GamePad {...this.props} onAddPlayer={this.handleAddPlayer}/>
      );
    }
  }
}

KarambaKaracho.propTypes = {
  isHost: PropTypes.bool,
  gameData: PropTypes.object,
  speak: PropTypes.func,
  socket: PropTypes.object,
};

KarambaKaracho.defaultProps = {};

export default KarambaKaracho;
