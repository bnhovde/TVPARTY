import Scene from "../Framework/Scene";
import * as PIXI from "pixi.js";
import {Howl} from "howler";
import TWEEN from "@tweenjs/tween.js";

/* Assets */
import hode_img from "../assets/plomma_hode.png"
import hake_img from "../assets/plomma_hake.png"
import wiener_img from "../assets/wiener.png"
import theme_ogg from "../assets/plonsters.ogg"
import knack_ogg from "../assets/knack.ogg"
import sausages_img from "../assets/sausages.jpg"
import unchecked_img from "../assets/unchecked.png"
import checked_img from "../assets/checked.png"

class SplashScreen extends Scene {
  setup() {
    this.assets = {
      sounds: {},
      sprites: {},
      containers: {},
    };

    this.setBackground();
    this.initFlyingSausages();
    this.initalizePlomma();
    this.drawTopBar();
    this.drawFooter();
    this.initUserInfo();
    this.setUpEventListener();

    /* Audio */
    let theme = new Howl({
      src: [theme_ogg],
      loop: true,
      volume: 0.5,
    });

    this.assets.sounds["theme"] = theme;
  }

  /**
   * Runs at every animation update
   * delta - animation delta, 1 if running at 100% performance
   */
  update(delta) {
  }

  initalizePlomma() {
    // Chin
    const head = PIXI.Sprite.fromImage(hode_img);
    const chin = PIXI.Sprite.fromImage(hake_img);
    head.anchor.set(0.5);
    chin.anchor.set(1, 1);
    chin.x = -28;
    chin.y = 230;
    chin.rotation = -0.5;

    let chinTween = new TWEEN.Tween(chin)
        .to({rotation: 0}, 500)
        .easing(TWEEN.Easing.Bounce.Out);

    let chinTweenBack = new TWEEN.Tween(chin)
        .to({rotation: -0.5}, 200)
        .easing(TWEEN.Easing.Quadratic.Out);

    chinTween.chain(chinTweenBack);
    chinTweenBack.chain(chinTween);
    chinTween.start();

    // Container
    let plommaContainer = new PIXI.Container();
    let x = this.application.renderer.width / 2;
    let y = this.application.renderer.height / 2;
    plommaContainer.x = x;
    plommaContainer.y = y;
    plommaContainer.addChild(head);
    plommaContainer.addChild(chin);
    plommaContainer.rotation = 0.5;

    let tween = new TWEEN.Tween(plommaContainer)
        .to({rotation: 0.5}, 400)
        .easing(TWEEN.Easing.Quadratic.Out);

    let tweenBack = new TWEEN.Tween(plommaContainer)
        .to({rotation: -0.5}, 400)
        .easing(TWEEN.Easing.Quadratic.Out);

    tween.chain(tweenBack);
    tweenBack.chain(tween);
    tween.start();

    this.stage.addChild(plommaContainer);

    this.plommaContainer = plommaContainer;
  }

  setUpEventListener() {
    // Set up event listener
    this.activeEventListener = (event) => {
      if (event.type === "submitClicked") {
        let playerName = event.playerName;
        let playerStatusSprite = this.assets.sprites.playerStatuses[playerName];
        playerStatusSprite.texture = PIXI.Texture.fromImage(checked_img);

        let bounceTween = new TWEEN.Tween(playerStatusSprite.scale)
            .to({x: 1.5, y: 1.5}, 150)
            .easing(TWEEN.Easing.Quadratic.Out);

        let bounceBackTween = new TWEEN.Tween(playerStatusSprite.scale)
            .to({x: 1.0, y: 1.0}, 500)
            .easing(TWEEN.Easing.Bounce.Out);

        let rotationTween = new TWEEN.Tween(playerStatusSprite)
            .to({rotation: 0.5}, 150)
            .easing(TWEEN.Easing.Quadratic.Out);

        let rotationBackTween = new TWEEN.Tween(playerStatusSprite)
            .to({rotation: 0}, 500)
            .easing(TWEEN.Easing.Bounce.Out);

        bounceTween.chain(bounceBackTween);
        bounceTween.start();
        rotationTween.chain(rotationBackTween);
        rotationTween.start();
        /* Audio */
        new Howl({
          src: [knack_ogg],
          volume: 1,
        }).play();

        this.playersReady[playerName] = true;

        let ready = true;
        for (let key in this.playersReady) {
          if (!this.playersReady[key]) {
            ready = false;
          }
        }

        if (ready) {
          window.setTimeout(() => {
            this.sceneManager.changeScene("description");
          }, 500);
        }

      }
    }
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

  // Override
  newGameData(newGameData) {
    this.gameData = newGameData;
    this.initUserInfo();
  }

  drawFooter() {
    let width = this.application.renderer.width;
    let height = this.application.renderer.height;
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000, 0.7);
    graphics.moveTo(0, height);
    graphics.lineTo(0, height - 125);
    graphics.lineTo(width, height - 125);
    graphics.lineTo(width, height);
    graphics.lineTo(0, height);
    graphics.endFill();
    this.stage.addChild(graphics);
  }

  initUserInfo() {
    this.playersReady = {};
    this.numberOfPlayers = 0;
    for(let key in this.gameData.players) {
      let playerName = this.gameData.players[key].name;
      this.playersReady[playerName] = false;
      this.numberOfPlayers++;
    }

    this.assets.sprites.playerStatuses = {};


    if(this.userInfoContainer) {
      this.stage.removeChild(this.userInfoContainer);
    }

    this.userInfoContainer = new PIXI.Container();

    let width = this.application.renderer.width;
    let height = this.application.renderer.height;

    let i = 0;
    for(let key in this.gameData.players) {
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
      text.position.x = circleX;
      text.position.y = height - 20;
      text.anchor.set(0.5);
      this.userInfoContainer.addChild(text);

      let uncheckedTexture = PIXI.Texture.fromImage(unchecked_img);
      const status = new PIXI.Sprite(uncheckedTexture);
      status.anchor.set(0.5);
      status.position.x = circleX;
      status.position.y = height - 80;

      this.assets.sprites.playerStatuses[playerName] = status;
      this.userInfoContainer.addChild(status);
      i++;
    }

    let bounds = this.userInfoContainer.getBounds();
    this.userInfoContainer.position.x = (width - bounds.width) / 2;

    this.stage.addChild(this.userInfoContainer);
  }

  drawTopBar() {
    let gameNameContainer = new PIXI.Container();

    /* Header */
    const style = new PIXI.TextStyle({
      dropShadow: true,
      fill: '#ffffff',
      fontFamily: 'Helvetica',
      fontSize: 50,
      fontWeight: 'bold',
      letterSpacing: 2,
      lineJoin: 'bevel',
      miterLimit: 5,
      strokeThickness: 3
    });

    const header = new PIXI.Text('Plommas Pølsespisekonkurranse!', style);
    header.scale.x = 1;
    header.scale.y = 1;
    header.anchor.set(0.5);
    header.x = this.application.renderer.width / 2;
    header.y = header.height;

    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000, 0.7);
    graphics.moveTo(this.application.renderer.width, 0);
    graphics.lineTo(this.application.renderer.width, 125);
    graphics.lineTo(0, 125);
    graphics.lineTo(0, 0);
    graphics.endFill();

    gameNameContainer.addChild(graphics);
    gameNameContainer.addChild(header);
    this.stage.addChild(gameNameContainer);
  }

  initFlyingSausages() {
    for (let i = 0; i < 40; ++i) {
      const wiener = PIXI.Sprite.fromImage(wiener_img);
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

      tween.loop = true;
      tween.chain(tween);
      tween.start();

      this.stage.addChild(wiener);
    }
  }

  newEvent(event) {
    this.activeEventListener(event);
  }

  // Override
  start() {
    super.start();
    this.assets.sounds["theme"].play();
  }

  destroy() {
    this.stop();
    super.destroy();
  }

  // Override
  stop() {
    super.stop();
    window.removeEventListener("gameDataChanged", this.boundReceiveGameEvent);
  }
}

export default SplashScreen;