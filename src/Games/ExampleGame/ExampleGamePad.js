import React, { Component } from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';

class GamePad extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      playerName: '',
    };
  }

  handleChangeName(e) {
    this.setState({
      playerName: e.target.value,
    });
  }

  render() {
    const { currentPlayer, playerLoaded, onAddPlayer } = this.props;

    // If player hasn't joined the game, show join game form
    if (!playerLoaded) {
      return (
        <form onSubmit={e => onAddPlayer(e, this.state.playerName)}>
          <input
            type="text"
            value={this.state.playerName}
            onChange={this.handleChangeName}
          />
          <button type="submit">Join game!</button>
        </form>
      );
    }

    return (
      <section>
        <h1>Hi, {currentPlayer.name}!</h1>
        <p>Welcome to the game</p>
      </section>
    );
  }
}

GamePad.propTypes = {
  currentPlayer: PropTypes.object,
  playerLoaded: PropTypes.bool.isRequired,
  onAddPlayer: PropTypes.func.isRequired,
};

export default GamePad;
