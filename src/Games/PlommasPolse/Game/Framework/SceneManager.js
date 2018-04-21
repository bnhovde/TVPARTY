class SceneManager {
  constructor(pixiApplication) {
    this.application = pixiApplication;
    this.scenes = {};
    this.currentScene = null;
  }

  /**
   * Adds a scene to the scene manager
   * @param sceneName - the reference to the scene
   * @param scene - the actual scene to add
   * @param backgroundColor - background color of the scene
   */
  addScene(sceneName, scene, backgroundColor = 0x282828) {
    scene.setup();
    scene.ticker.add(scene.update.bind(scene));
    this.scenes[sceneName] = {};
    this.scenes[sceneName].scene = scene;
    this.scenes[sceneName].backgroundColor = backgroundColor;

    if (!this.currentScene) {
      this.currentScene = scene;
    }
  }

  /**
   * Change the scene to the scene referenced by sceneName
   * @param sceneName - the scene reference
   */
  changeScene(sceneName) {
    this.currentScene.stop();

    /* Setup new scene */
    this.currentScene = this.scenes[sceneName].scene;
    this.application.renderer.backgroundColor = this.scenes[sceneName].backgroundColor;
    this.currentScene.start();
    this.application.stage = this.currentScene.stage;
  }

  /**
   * Destroys the scene
   * @param sceneName
   */
  destroyScene(sceneName) {
    this.scenes[sceneName].scene.destroy();
  }

  newGameData(gameData) {
    for(let key in this.scenes) {
      this.scenes[key].scene.newGameData(gameData);
    }
  }

  /**
   * Will receive game events and delegate to active scene
   * @param event
   */
  newEvent(event) {
    /*for(let key in this.scenes) {
      this.scenes[key].scene.newEvent(event);
    }*/
    this.currentScene.newEvent(event);
  }
}

export default SceneManager;