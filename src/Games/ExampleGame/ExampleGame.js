import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

// Helpers
import { loadState } from './../../utilities/localstorage';

// Components
import GamePad from './ExampleGamePad';

class ExampleGame extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {};
  }

  componentDidMount() {
    // Check if player is already in game
    const state = loadState();
    const activeGame = state.currentGame === this.props.gameData.gameCode;
    if (activeGame && !this.props.isHost) {
      const { players } = this.props.gameData;
      const playerId = Object.keys(players).find(
        p => players[p].name === state.playerName,
      );
      this.props.updatePlayerData(this.props.gameData.gameCode, playerId, {
        ...players[playerId],
        inactive: false,
      });
      this.props.setCurrentPlayer(playerId);
    }

    // Attach generic event handlers
    this.props.socket.on('event', data => {
      if (data.type === 'start') {
        this.props.updateGameData(this.props.gameData.gameCode, {
          ...this.props.gameData,
          screen: 'game',
        });
      }
    });

    // If playter leaves game, set as inactive
    this.props.socket.on('player left game', data => {
      const { players = {} } = this.props.gameData;
      const playerId = Object.keys(players).find(
        p => players[p].socketId === data.socketId,
      );
      if (playerId) {
        this.props.updatePlayerData(this.props.gameData.gameCode, playerId, {
          ...players[playerId],
          inactive: true,
        });
      }
    });
  }

  handleAddPlayer(e, playerName) {
    e.preventDefault();

    // Add player data to firebase (through redux)
    this.props.addPlayer(this.props.gameData.gameCode, {
      name: playerName || 'Unknown player',
      socketId: this.props.socket.id,
    });

    // Play welcome audio message
    this.props.sendEvent({
      type: 'greetPlayer',
      name: playerName,
    });
  }

  render() {
    const { players = {}, gameCode = '' } = this.props.gameData;

    // For regular players, return the game controller
    if (!this.props.isHost) {
      return <GamePad {...this.props} onAddPlayer={this.handleAddPlayer} />;
    }

    // Otherwise, return the host screen
    return (
      <div>
        <h1>ExampleGame!</h1>
        <p>Game code: {gameCode}</p>
        <h2>Connected players:</h2>
        {Object.keys(players)
          .filter(p => !players[p].inactive)
          .map(p => (
            <div key={p}>
              <p>{players[p].name}</p>
            </div>
          ))}
      </div>
    );
  }
}

ExampleGame.propTypes = {
  socket: PropTypes.object,
  gameData: PropTypes.object,
  gameCode: PropTypes.string,
  isHost: PropTypes.bool.isRequired,
  sendEvent: PropTypes.func.isRequired,
  addPlayer: PropTypes.func.isRequired,
  updatePlayerData: PropTypes.func.isRequired,
  setCurrentPlayer: PropTypes.func.isRequired,
  updateGameData: PropTypes.func.isRequired,
};

ExampleGame.defaultProps = {
  gameData: {},
  gameCode: '',
};

export default ExampleGame;
