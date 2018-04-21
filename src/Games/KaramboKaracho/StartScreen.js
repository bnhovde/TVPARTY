import React, {Component} from "react";
import PropTypes from "prop-types";
import "./StartScreen.css";

class StartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersReady: {}
    };
    this.receiveEvent = this.receiveEvent.bind(this);
    this.props.socket.on('event', this.receiveEvent);
  }

  receiveEvent(data) {
    if (data.type === 'submitClicked') {
      let readyState = this.state.playersReady;
      readyState[data.playerName].ready = true;
      this.setState({
        playersReady: readyState,
      });

      let gameReady = true;
      for (let key in readyState) {
        if (readyState[key].ready === false) {
          gameReady = false;
        }
      }

      if (gameReady) {
        this.props.handlePlayersReady();
      }
    }
  }

  componentWillUnmount() {
    this.props.socket.removeListener('event', this.receiveEvent);
  }

  componentWillReceiveProps(newProps) {
    const {
      gameData,
    } = newProps;

    let readyState = this.state.playersReady;

    for (let key in gameData.players) {
      let player = gameData.players[key].name;
      readyState[player] = {
        ready: false
      };
    }

    this.setState({
      playersReady: readyState,
    })
  }

  render() {
    const {gameData} = this.props;

    let playersJsx = [];
    for (let key in gameData.players) {
      let player = gameData.players[key];
      let className = ["player"]
      if (this.state.playersReady[player.name].ready === true) {
        className.push("ready")
      }
      else {
        className.push("not-ready");
      }
      playersJsx.push(
          <div key={key} className={className.join(" ")}>
            {player.name}
          </div>
      );
    }

    return (
        <div className="StartScreen">
          <div className="gameCode">Gamecode: {gameData.gameCode}</div>
          <div className="players">
            {playersJsx}
          </div>
        </div>
    );
  }
}

StartScreen.propTypes = {
  gameData: PropTypes.object,
  handlePlayersReady: PropTypes.func,
  socket: PropTypes.object,
};

StartScreen.defaultProps = {
  gameData: {},
  handlePlayersReady: () => {

  },
};

export default StartScreen;
