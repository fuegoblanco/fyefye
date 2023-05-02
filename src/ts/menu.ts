// src/menuScene.ts
import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    // Display the game logo
    const logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, "logo");

    // Make the logo responsive
    this.scale.displaySize.on("resize", (gameSize: Phaser.Structs.Size) => {
      logo.setPosition(gameSize.width / 2, gameSize.height / 2);
    });
  }
}
