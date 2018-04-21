import Scene from "../Framework/Scene";
import * as PIXI from "pixi.js";
import TWEEN from "@tweenjs/tween.js";
import {Howl} from "howler";

/* Assets */
import sausages_img from "../assets/sausages.jpg"
import unchecked_img from "../assets/unchecked.png"
import checked_img from "../assets/checked.png"
import knack_ogg from "../assets/knack.ogg"
import theme_ogg from "../assets/plonsters.ogg"


class Description extends Scene {
  setup() {
    this.assets = {
      sounds: {},
      sprites: {},
      containers: {},
    };
    this.activeEventListener = () => {
    }
    this.allowInput = false;
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
  }

  showDescription() {
    /* Header */
    const style = new PIXI.TextStyle({
      dropShadow: true,
      fill: '#ffffff',
      fontFamily: 'Helvetica',
      fontSize: 32,
      fontWeight: 'bold',
      letterSpacing: 2,
      lineJoin: 'bevel',
      miterLimit: 5,
      strokeThickness: 3
    });

    let description = `
    Plommas Pølsespisekonkurranse!
    1. Alle får total 10 pølser hver runde
    2. Velg hvor mange pølser du vil spise (1-10)
    3. Den som spiser flest pølser i en runde får hjerteinfarkt og ingen poeng
    4. Den som har spist flest pølser når spillet er over er Storplomma!`;


    const descriptionText = new PIXI.Text(description, style);
    descriptionText.scale.x = 1;
    descriptionText.scale.y = 1;
    descriptionText.anchor.set(0.5);
    descriptionText.x = this.application.renderer.width / 2;
    descriptionText.y = descriptionText.height;

    this.stage.addChild(descriptionText);
  }

  setUpEventListener() {
    this.allowInput = true;
    // Set up event listener
    this.activeEventListener = (event) => {
      if (event.type === "submitClicked" && this.allowInput) {
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
          this.allowInput = false;
          window.setTimeout(() => {
            this.sceneManager.changeScene("gameScene");
          }, 500);
        }

      }
    }
  }

  newEvent(event) {
    this.activeEventListener(event);
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


  destroy() {
    this.stop();
    super.destroy();
  }

  update(delta) {
  }

  start() {
    this.setUpEventListener();
    this.setBackground();
    this.drawFooter();
    this.initUserInfo();
    this.showDescription();
  }
}

export default Description;