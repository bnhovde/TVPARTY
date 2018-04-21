import React from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

// Redux
import { create } from './../../store/games';

// Helpers
import { generateGameCode } from './../../utilities/helpers';
import games from './../../Games/games';

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

  startNewGame(e) {
    e.preventDefault();

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <h1>TVPARTY</h1>

        <h2>Join a game</h2>

        <form onSubmit={this.handleJoinGame}>
          <input
            required
            placeholder="ABCD"
            value={gameCode}
            onChange={({ target }) => {
              this.handleChange('gameCode', target.value.toUpperCase());
            }}
          />
          <button type="submit" disabled={gameCode.length !== 4}>
            Enter
          </button>
        </form>

        <h2>- or - </h2>

        <form onSubmit={this.startNewGame}>
          <select
            name="gameType"
            onChange={this.handleChange}
            selected={gameType}
          >
            <option value="" disabled>
              Select game
            </option>
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>

          <button type="submit">Start new game</button>
        </form>
      </div>
    );
  }
}

Dashboard.propTypes = {
  createGame: PropTypes.func.isRequired,
  hostGame: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    createGame: gameData => dispatch(create(gameData)),
    hostGame: gameCode => dispatch(push(`/host/${gameCode}`)),
    joinGame: gameCode => dispatch(push(`/${gameCode}`)),
  };
}

export default connect(null, mapDispatchToProps)(Dashboard);
