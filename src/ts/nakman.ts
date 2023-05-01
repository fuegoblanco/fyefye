/** @format */

// You can write more code here

/* START OF COMPILED CODE */

import Phaser from 'phaser';
import AlignCanvas from '../components/AlignCanvas';
import PushOnClick from '../components/PushOnClick';
import { Pacman } from './Pacman';
import { Map } from './Map/Map';
import { directionEnum } from './game-interfaces/direction.interface';
import { GameMode } from './game-interfaces/modes.interface';
import { RedGhost } from './Enemy/RedGhost';
import { BlueGhost } from './Enemy/BlueGhost';
import { PinkGhost } from './Enemy/PinkGhost';
import { OrangeGhost } from './Enemy/OrangeGhost';
import { Enemy } from './Enemy/Enemy';
import { pacmanAnimInit, ghostsAnimInit } from './Utils/animations';
import { Utils } from './Utils/utils';
import { Tile, fruit } from './Tile';
import WebFont = require('webfontloader');

export let scene;
export let map: Map;
let cursors;
let player;
export let pacman: Pacman;
export let redGhost: Enemy;
let pinkGhost: Enemy;
let blueGhost: Enemy;
let orangeGhost: Enemy;
let cam;
export let level = 1;
export const SPEED = 3;
export let points = 0;
export const FRIGHTENED_TIME = 7000;
let frigthenedTimer = null;
export let SCATTER_TIMER = 12000;
export let SCATTER_DURATION = 6000;

let btnRetry;
let backgroundMenu;

export const ENEMY_SPAWN_TIME = 4000;
export const ENEMY_SETFREE_TIME = 5000;

const FRUIT_SPAWN_TIMER = 3000; //20000
const FRUIT_TIME = 10000;
let isFruit = false;
let shouldFruitSpawn = true;
let fruitTile: Tile;
let previousTileValue: number;
export const CENTER_MAP_POSITION = { x: 275, y: 275 };

let pointGUI;
let upButton;
let downButton;
let leftButton;
let rightButton;

export default class Nakman extends Phaser.Scene {
  imageGroup: Phaser.GameObjects.Group;
  menuGameOver: Phaser.GameObjects.Group;
  pointsGroup: Phaser.Physics.Arcade.StaticGroup;
  powerUpGroup: Phaser.Physics.Arcade.StaticGroup;
  fruitGroup: Phaser.Physics.Arcade.StaticGroup;
  enemyGroup;
  maxDots = 0;
  dots = 0;

  constructor() {
    super('Nakman');
    this.enemyCollide = this.enemyCollide.bind(this);
    this.fruitSpawner = this.fruitSpawner.bind(this);
    this.collectPowerUp = this.collectPowerUp.bind(this);
    this.collectPoint = this.collectPoint.bind(this);
  }

  //****************** PRELOAD  ******************/
  preload() {
    this.load.spritesheet('pacman', 'assets/pacmanSpriteSheet.png', {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet('ghosts', 'assets/ghosts.png', {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet('fruits', 'assets/fruits.png', {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.image('tileImage1', 'assets/firstTile.png');
    this.load.image('tileImage2', 'assets/secondTile.png');
    this.load.image('tileImage3', 'assets/thirdTile.png');
    this.load.image('tileImage4', 'assets/forthTile.png');
    this.load.image('pointImage', 'assets/point.png');
    this.load.image('power-up', 'assets/power-up.png');
    this.load.image('door', 'assets/doorTile.png');
    this.load.image('blueDot', 'assets/blueDot.png');
    this.load.image('frightened', 'assets/frightened.png');
    this.load.image('GameoverBackground', 'assets/gameoverBackground.png');
    this.load.image('GameoverButton', 'assets/gameoverButton.png');
    this.load.image('UpButton', 'assets/up.png');
    this.load.image('DownButton', 'assets/down.png');
    this.load.image('LeftButton', 'assets/left.png');
    this.load.image('RightButton', 'assets/right.png');
    this.menuGameOver = this.add.group();
    this.imageGroup = this.add.group();
    this.pointsGroup = this.physics.add.staticGroup();
    this.powerUpGroup = this.physics.add.staticGroup();
    this.fruitGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.add.group();

    scene = this;
  }

  editorCreate(): void {
    // CanvasRef
    const canvasRef = this.add.image(0, 0, 'canvasIcon');
    canvasRef.visible = false;
    // canvasRef (components)
    new AlignCanvas(canvasRef);

    this.events.emit('scene-awake');
  }

  private bg!: Phaser.GameObjects.Image;
  public fufuSuperDino!: Phaser.GameObjects.Image;

  /* START-USER-CODE */
  // Write your code here

  create() {
    this.editorCreate();

    this.scene.launch('Ui');

    // Hide in production
    // Reference guide rectangle
    const safeArea = this.add
      .rectangle(
        0,
        0,
        globalThis.screenBaseSize.width,
        globalThis.screenBaseSize.height,
        0xffffff,
        0
      )
      .setOrigin(0)
      .setDepth(1);
    safeArea.setStrokeStyle(2, 0x1a65ac);
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
