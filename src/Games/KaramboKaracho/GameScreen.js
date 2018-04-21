import React, {Component} from "react";
import PropTypes from "prop-types";
import Alcometer from "./Alcometer";
import ScoreBoard from "./ScoreBoard";
import "./GameScreen.css";

class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.startRound = this.startRound.bind(this);
    this.startCountDown = this.startCountDown.bind(this);
    this.getNextPlayer = this.getNextPlayer();

    this.props.socket.on('event', event => {
      if(event.type === "submitClicked" && event.playerName === this.state.currentPlayer && this.enableInput) {
        this.enableInput = false;
        this.iFramRef.contentWindow.newEvent(event);
        this.startRound(() => {
          this.enableInput = true;
          this.setState({
            currentPlayer: this.getNextPlayer()
          });
          this.spawnNewBottle();
        });
      }
    });

    let scores = [];
    for (let key in props.gameData.players) {
      scores.push({
        playerName: props.gameData.players[key].name,
        score: 0,
      });
    }

    this.state = {
      totalScore: 0,
      currentPlayer: scores[0].playerName,
      scores,
    };

    this.enableInput = true;
    this.scoreCallback = this.scoreCallback.bind(this);
  }

  getNextPlayer() {
    let currentPlayer = 0;
    return () => {
      currentPlayer++;
      console.log(currentPlayer, "currentPlayer");
      console.log(this.state.scores.length, "this.state.scores.length");
      if(currentPlayer === this.state.scores.length) {
        currentPlayer = 0;
      }
      return this.state.scores[currentPlayer].playerName;
    }
  }


  componentDidMount() {
    const {
      gameData,
    } = this.props;
    window.setTimeout(() => {
      this.iFramRef.contentWindow.register(this.scoreCallback);
      this.spawnNewBottle();
    }, 2000);
  }

  startRound(finishCallback) {
    this.startCountDown(finishCallback);
  }

  spawnNewBottle() {
    if(this.iFramRef.contentWindow) {
      this.iFramRef.contentWindow.spawnNewBottle();
    }
  }

  startCountDown(finishCallback) {
    let counter = 0;
    let interval = window.setInterval(() => {
      counter++;
      if(this.iFramRef.contentWindow) {
        this.iFramRef.contentWindow.setCountDownText(20-counter);
      }
      if(counter === 20) {
        window.clearInterval(interval);
        this.iFramRef.contentWindow.setCountDownText("");
        finishCallback();
      }

    }, 1000)
  }

  componentWillReceiveProps(newProps) {
    const {
      gameData,
      isHost,
      id
    } = newProps;
  }

  scoreCallback(points) {
    this.setState({
      totalScore: this.state.totalScore += points,
    });

    let currentScores = this.state.scores.map((player) => {
      if(player.playerName === this.state.currentPlayer) {
        return {
          playerName: player.playerName,
          score: player.score + points,
        }
      }
      return player;
    });

    this.setState({
      scores: currentScores
    });
  }

  render() {
    return (
        <div>
          <div className="gameWindow">
            <ScoreBoard
                currentPlayer={this.state.currentPlayer}
                scores={this.state.scores}
            />
            <div className="playerScreen">
              <iframe
                  className="gameIframe"
                  ref={ref => {
                    this.iFramRef = ref;
                  }}
                  height="800"
                  width="1200"
                  src={`${process.env.PUBLIC_URL}/assets/karambaKaracho/phaserIframe.html`}
              />
              <Alcometer
                  percentage={this.state.totalScore}
              />
            </div>
          </div>
        </div>
    );
  }
}

GameScreen.propTypes = {
  isHost: PropTypes.bool,
  gameData: PropTypes.object,
  speak: PropTypes.func,
  socket: PropTypes.object,
};

GameScreen.defaultProps = {};

export default GameScreen;
