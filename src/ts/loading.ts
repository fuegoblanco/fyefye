// src/preloadScene.ts
import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    // Load your game assets here, for example:
    this.load.image("logo", "./assets/eth.png");
  }

  create() {
    // Once assets are loaded, transition to the menu scene
    this.scene.start("Menu");
  }
}
