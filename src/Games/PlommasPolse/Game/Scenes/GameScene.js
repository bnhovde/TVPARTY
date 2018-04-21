import Scene from "../Framework/Scene";
import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import {Howl} from "howler";

/* Assets */
import sausages_img from "../assets/sausages.jpg"
import knack_ogg from "../assets/knack.ogg"
import tick_mp3 from "../assets/tick.mp3"
import wiener_img from "../assets/wiener.png"
import win_mp3 from "../assets/win.mp3"
import lose_mp3 from "../assets/lose.mp3"

class GameScene extends Scene {
  setup() {
    // Set up event listener
    this.activeEventListener = (event) => {
      if (event.type === "submitClicked" && this.enableInput) {
        let playerName = event.playerName;

        let sausageCount = parseInt(event.sausageCount);
        if (sausageCount >= 1 && sausageCount <= 10) {
          this.roundData[this.currentRound][playerName] = sausageCount;
        }

        let playerNameText = this.assets.sprites.playerNames[playerName];

        let bounceTween = new TWEEN.Tween(playerNameText.scale)
            .to({x: 1.5, y: 1.5}, 150)
            .easing(TWEEN.Easing.Quadratic.Out);

        let bounceBackTween = new TWEEN.Tween(playerNameText.scale)
            .to({x: 1.0, y: 1.0}, 500)
            .easing(TWEEN.Easing.Bounce.Out);

        bounceTween.chain(bounceBackTween);
        bounceTween.start();

        /* Audio */
        new Howl({
          src: [knack_ogg],
          volume: 1,
        }).play();
      }
    };
  }

  initGame() {
    this.assets = {
      sounds: {},
      sprites: {},
      containers: {},
    };

    // Init data
    this.enableInput = false;
    this.currentRound = 0;

    // Count rounds
    this.numberOfRounds = 0;
    for (let key in this.gameData.players) {
      this.numberOfRounds++;
    }

    this.roundData = [];
    for (let i = 0; i < this.numberOfRounds; i++) {
      this.roundData.push({});

      for (let key in this.gameData.players) {
        let playerName = this.gameData.players[key].name;
        this.roundData[i][playerName] = 0;
      }
    }
  }

  newGameData(newGameData) {
    this.gameData = newGameData;
  }

  setBackground() {
    const background = PIXI.Sprite.fromImage(sausages_img);
    background.zIndex = 0;
    background.scale.x = this.application.renderer.width / 1240;
    background.scale.y = this.application.renderer.width / 827;
    background.tint = 0xFFFAAA;
    let blurFilter1 = new PIXI.filters.BlurFilter();
    background.filters = [blurFilter1];
    this.stage.addChild(background);
  }

  startGameLoop() {
    this.startFlyingSausages();
    this.startRound(this.currentRound, () => {
      this.enableInput = true;
      this.showLoadingAnimations(() => {
        this.enableInput = false;
        let tweenChain = new TweenChain();
        for (let key in this.gameData.players) {
          let playerName = this.gameData.players[key].name;
          tweenChain.add(this.showPlayerScore(playerName));
        }
        tweenChain.start(() => {
          this.currentRound++;
          if (this.currentRound === this.numberOfRounds) {
            this.showWinner();
          }
          else {
            this.startGameLoop();
          }
        });
      });
    });
  }

  showWinner() {
    let width = this.application.renderer.width;
    let height = this.application.renderer.height;

    let maxScore = 0;
    let bestPlayer = "";

    for (let key in this.gameData.players) {
      let playerName = this.gameData.players[key].name;
      let score = this.assets.sprites.playerScores[playerName].text;
      if(parseInt(score) > maxScore) {
        maxScore = parseInt(score);
        bestPlayer = playerName;
      }
    }

    const style = new PIXI.TextStyle({
      fill: "#FFFFFF",
      fontFamily: 'Helvetica',
      fontSize: 100,
      fontWeight: 'bold',
      letterSpacing: 2,
      lineJoin: 'bevel',
      miterLimit: 5,
      strokeThickness: 3
    });

    const playerText = new PIXI.Text(bestPlayer, style);
    playerText.position.x = width / 2;
    playerText.position.y = height / 2;
    playerText.anchor.set(0.5);
    this.stage.addChild(playerText);

    let winnerTween1 = new TWEEN.Tween(playerText.scale)
        .to({x: 2, y: 2}, 300)
        .easing(TWEEN.Easing.Bounce.Out)
        .repeat(Infinity);

    let winnerTween2 = new TWEEN.Tween(playerText.scale)
        .to({x: 1, y: 1}, 300)
        .easing(TWEEN.Easing.Bounce.Out);


    winnerTween1.chain(winnerTween2);
    winnerTween1.start();
  }

  showPlayerScore(name) {
    let width = this.application.renderer.width;
    let height = this.application.renderer.height;
    let roundScores = this.roundData[this.currentRound];
    let playerScore = roundScores[name];
    let playerScoreText = this.assets.sprites.playerScores[name];
    let fill = "#fff3ec";
    let sound = win_mp3;
    let addToScore = playerScore;

    // Find max score
    let maxScore = 0;
    for (let key in roundScores) {
      if (roundScores[key] >= maxScore) {
        maxScore = roundScores[key];
      }
    }

    if (maxScore === playerScore) {
      addToScore = 0;
      fill = "#9a0013";
      sound = lose_mp3;
    }

    const style = new PIXI.TextStyle({
      fill: fill,
      fontFamily: 'Helvetica',
      fontSize: 100,
      fontWeight: 'bold',
      letterSpacing: 2,
      lineJoin: 'bevel',
      miterLimit: 5,
      strokeThickness: 3
    });

    const playerText = new PIXI.Text(name + ": " + playerScore, style);
    playerText.position.x = width / 2;
    playerText.position.y = -100;
    playerText.anchor.set(0.5);
    this.stage.addChild(playerText);

    let bounceDown = new TWEEN.Tween(playerText.position)
        .to({y: height / 6}, 1000)
        .easing(TWEEN.Easing.Bounce.Out)
        .onComplete(() => {
          new Howl({
            src: [sound],
            volume: 0.5,
          }).play();
          playerScoreText.text = parseInt(addToScore) + parseInt(playerScoreText.text);
        });

    let bounceUp = new TWEEN.Tween(playerText.position)
        .to({y: -100}, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .delay(1000);

    bounceDown.chain(bounceUp);

    return [bounceDown, bounceUp];
  };

  showLoadingAnimations(callBack) {
    this.startCountdown(15, callBack);
    this.startHowManySausagesText();
  }

  startFlyingSausages() {
    this.sausageContainer.renderable = true;
  }

  initFlyingSausages() {
    this.sausageContainer = new PIXI.Container();
    this.stage.addChild(this.sausageContainer);
    this.sausageContainer.renderable = false;
    for (let i = 0; i < 40; ++i) {
      const wiener = PIXI.Sprite.fromImage(wiener_img);
      wiener.zOrder = 0;
      wiener.rotation = 0.5;
      wiener.scale.x = 0.3;
      wiener.scale.y = 0.3;
      wiener.x = -150;
      wiener.y = Math.random() * this.application.renderer.height + Math.random() * -500;

      let tween = new TWEEN.Tween(wiener)
          .to({
            x: this.application.renderer.width + 100,
            y: this.application.renderer.height + 100,
            rotation: Math.random() * 7,
          }, 3000)
          .delay(Math.random() * 3000)
          .repeat(Infinity);

      tween.start();

      this.sausageContainer.addChild(wiener);
    }
  }

  startHowManySausagesText() {
    let width = this.application.renderer.width;
    let height = this.application.renderer.height;

    const style = new PIXI.TextStyle({
      fill: '#fff3ec',
      fontFamily: 'Helvetica',
      fontSize: 100,
      fontWeight: 'bold',
      letterSpacing: 2,
      lineJoin: 'bevel',
      miterLimit: 5,
      strokeThickness: 3
    });

    const sausageText = new PIXI.Text("SPIS PØLSER", style);
    sausageText.position.x = width / 2;
    sausageText.position.y = -100;
    sausageText.anchor.set(0.5);
    this.stage.addChild(sausageText);

    let bounceDown = new TWEEN.Tween(sausageText.position)
        .to({y: height / 6}, 1000)
        .easing(TWEEN.Easing.Bounce.Out);

    let bounceUp = new TWEEN.Tween(sausageText.position)
        .to({y: -100}, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .delay(2000);

    bounceDown.chain(bounceUp);
    bounceDown.start();
  }

  startRound(roundNumber, callBack) {
    let width = this.application.renderer.width;
    let height = this.application.renderer.height;

    const style = new PIXI.TextStyle({
      fontFamily: 'Helvetica',
      fontSize: 100,
      fontWeight: 'bold',
      letterSpacing: 2,
      lineJoin: 'bevel',
      miterLimit: 5,
      strokeThickness: 3
    });

    const roundText = new PIXI.Text("Round " + (roundNumber + 1), style);
    roundText.position.x = width / 2;
    roundText.position.y = height / 2;
    roundText.anchor.set(0.5);
    this.stage.addChild(roundText);

    roundText.scale.x = 1;
    roundText.scale.y = 1;
    roundText.alpha = 1;

    let expandTween = new TWEEN.Tween(roundText.scale)
        .to({x: 5, y: 5}, 3000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(function () {
          callBack();
        });

    let alphaTween = new TWEEN.Tween(roundText)
        .to({alpha: 0.0}, 3000)
        .easing(TWEEN.Easing.Quadratic.Out);

    expandTween.start();
    alphaTween.start();
  }

  startCountdown(startTime, finishedCallback) {
    let width = this.application.renderer.width;
    let height = this.application.renderer.height;

    const style = new PIXI.TextStyle({
      fontFamily: 'Helvetica',
      fontSize: 100,
      fontWeight: 'bold',
      letterSpacing: 2,
      lineJoin: 'bevel',
      miterLimit: 5,
      strokeThickness: 3
    });

    const countdownText = new PIXI.Text(startTime, style);
    countdownText.position.x = width / 2;
    countdownText.position.y = height / 2;
    countdownText.anchor.set(0.5);
    this.stage.addChild(countdownText);

    /* Audio */
    let tickSound = new Howl({
      src: [tick_mp3],
      loop: true,
      volume: 1,
    });

    tickSound.play();

    let countdownFunc = () => {
      if (startTime === 0) {
        tickSound.stop();
        finishedCallback();
        this.stage.removeChild(countdownText);
        return;
      }
      countdownText.scale.x = 1;
      countdownText.scale.y = 1;
      countdownText.alpha = 1;
      countdownText.text = startTime--;

      let expandTween = new TWEEN.Tween(countdownText.scale)
          .to({x: 5, y: 5}, 1000)
          .easing(TWEEN.Easing.Quadratic.Out);

      let alphaTween = new TWEEN.Tween(countdownText)
          .to({alpha: 0.0}, 1000)
          .easing(TWEEN.Easing.Quadratic.Out);

      expandTween.onComplete(function () {
        countdownFunc();
      });

      expandTween.start();
      alphaTween.start();
    };
    countdownFunc();
  }

  initUserInfo() {
    this.playersReady = {};
    this.assets.sprites.playerNames = {};
    this.assets.sprites.playerScores = {};
    let userInfoContainer = new PIXI.Container();

    let width = this.application.renderer.width;
    let height = this.application.renderer.height;

    let graphics = new PIXI.Graphics();

    let i = 0;
    for (let key in this.gameData.players) {
      let circleX = 50 + (width / 7) * i;
      let playerName = this.gameData.players[key].name;

      const style = new PIXI.TextStyle({
        fill: '#fff3ec',
        fontFamily: 'Helvetica',
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 2,
        lineJoin: 'bevel',
        miterLimit: 5,
        strokeThickness: 3
      });

      const text = new PIXI.Text(playerName, style);

      this.assets.sprites.playerNames[playerName] = text;

      text.position.x = circleX;
      text.position.y = height - 20;
      text.anchor.set(0.5);
      userInfoContainer.addChild(text);

      const scoreStyle = new PIXI.TextStyle({
        fill: '#fff3ec',
        fontFamily: 'Helvetica',
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 2,
        lineJoin: 'bevel',
        miterLimit: 5,
        strokeThickness: 3
      });

      const scoreText = new PIXI.Text(0, style);
      scoreText.anchor.set(0.5);
      scoreText.position.x = circleX;
      scoreText.position.y = height - 80;
      this.assets.sprites.playerScores[playerName] = scoreText;

      this.assets.containers["footer"] = userInfoContainer;
      userInfoContainer.addChild(scoreText);
      i++;
    }

    let bounds = userInfoContainer.getBounds();
    userInfoContainer.position.x = (width - bounds.width) / 2;

    graphics.beginFill(0x000000, 0.7);
    graphics.moveTo(0, height);
    graphics.lineTo(0, height - 125);
    graphics.lineTo(width, height - 125);
    graphics.lineTo(width, height);
    graphics.lineTo(0, height);
    graphics.endFill();

    this.stage.addChild(graphics);
    this.stage.addChild(userInfoContainer);
  }

  update(delta) {
  }

  newEvent(event) {
    this.activeEventListener(event);
  }

  start() {
    this.sendEvent({
      type: 'gameStarted',
    });

    super.start();
    this.initGame();
    this.setBackground();
    this.initFlyingSausages();
    this.initUserInfo();
    this.startGameLoop();
  }
}

class TweenChain {
  constructor() {
    this.tweenChain = [];
  }

  add(tweenPair) {
    this.tweenChain.push(tweenPair);
  }

  start(callback) {
    for (let i = 0; i < this.tweenChain.length; i++) {
      this.tweenChain[i][1].onComplete(() => {
        this.tweenChain[i + 1][0].start();
      });
    }
    this.tweenChain[0][0].start();
    this.tweenChain[this.tweenChain.length - 1][1].onComplete(callback);

  }
}

export default GameScene;