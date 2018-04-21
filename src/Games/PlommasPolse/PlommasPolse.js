import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as PIXI from "pixi.js";
import './PlommasPolse.css';
import Game from "./Game/Game";
import GamePad from "./Game/Controller/GamePad";

class PlommasPolse extends Component {
  constructor(props) {
    super(props);
    this.handleAddPlayer = this.handleAddPlayer.bind(this);
  }
  componentDidMount() {
    const {
      isHost,
      gameData,
    } = this.props;

    if(isHost) {
      this.props.socket.on('event', data => {
        if (data.type === 'submitClicked') {
          this.game.newEvent(data);
        }
      });
    }


    if(isHost) {
      let width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      let height= Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

      // Initialize Pixi canvas
      const gameCanvasPlaceHolder = document.getElementById("gameCanvas");
      const app = new PIXI.Application(width, height-5, {backgroundColor: 0x1099bb,  antialias: true });

      gameCanvasPlaceHolder.appendChild(app.view);

      this.game = new Game(app, {
        gameData,
        socket: this.props.socket,
        sendEvent: this.props.sendEvent,
      });
    }
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

    if(this.game && isHost) {
      this.game.newGameData(gameData);
    }
  }

  render() {
    const {
      isHost
    } = this.props;

    if(isHost) {
      return (
          <div id="gameCanvas">
          </div>
      );
    } else {
      return(
          <GamePad {...this.props} onAddPlayer={this.handleAddPlayer} />
      );
    }
  }
}

PlommasPolse.propTypes = {
  isHost: PropTypes.bool,
  gameData: PropTypes.object,
  speak: PropTypes.func,
  socket: PropTypes.object,
};

PlommasPolse.defaultProps = {
};

export default PlommasPolse;
