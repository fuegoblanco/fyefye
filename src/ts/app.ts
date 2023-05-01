/** @format */

import 'phaser';
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
import { Tile, fruit, tileType } from './Tile';
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

let cam: Phaser.Cameras.Scene2D.Camera;
export let level = 1;
export const SPEED = 3;
export let points = 0;
export const FRIGHTENED_TIME = 7000;
let frigthenedTimer = null;
export let SCATTER_TIMER = 12000;
export let SCATTER_DURATION = 6000;

let btnRetry: Phaser.GameObjects.Image;
let backgroundMenu: any;

export const ENEMY_SPAWN_TIME = 4000;
export const ENEMY_SETFREE_TIME = 5000;

const FRUIT_SPAWN_TIMER = 3000; //20000
const FRUIT_TIME = 10000;
let isFruit = false;
let shouldFruitSpawn = true;
let fruitTile: Tile;

let previousTileValue: number;
export const CENTER_MAP_POSITION = { x: 475, y: 475 };

let pointGUI: Phaser.GameObjects.Text;
let upButton: Phaser.GameObjects.Sprite;
let downButton: Phaser.GameObjects.Sprite;
let leftButton: Phaser.GameObjects.Sprite;
let rightButton: Phaser.GameObjects.Sprite;
let abutton: Phaser.GameObjects.Sprite;
let bbutton: Phaser.GameObjects.Sprite;

export class GameScene extends Phaser.Scene {
  imageGroup: Phaser.GameObjects.Group;
  menuGameOver:  Phaser.GameObjects.Group;
  pointsGroup: Phaser.Physics.Arcade.StaticGroup;
  powerUpGroup: Phaser.Physics.Arcade.StaticGroup;
  fruitGroup: Phaser.Physics.Arcade.StaticGroup;
  enemyGroup;
  maxDots = 0;
  dots = 0;

  constructor() {
    super({});
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
    this.load.image('a', 'assets/a.png');
    this.load.image('b', 'assets/b.png');
    this.load.image("pointImage", "assets/point.png");
    this.load.image("tileImage1", "assets/firstTile.png");
    this.load.image("tileImage2", "assets/secondTile.png");
    this.load.image("tileImage3", "assets/thirdTile.png");
    this.load.image("tileImage4", "assets/forthTile.png");
    this.load.image('power-up', 'assets/eth.png');
   this.load.image('door', 'assets/doorTile.png');
    this.load.image('frightened', 'assets/frightened.png');
   // this.load.image('GameoverBackground', 'assets/gameoverBackground.png');
    this.load.image('GameoverButton', 'assets/retry.png');
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

  //************************************ CREATE  ************************************/
  create() {
    player = this.physics.add.sprite(325, 575, 'pacman');
    console.log(player);


    pointGUI = this.add.text(500, 1050, 'SCORE: 0', {
      fontFamily: 'digital-7',
      fontSize: '80px',
    });
    

    abutton = this.add.sprite(800, 1250, 'a').setScale(2).setInteractive();
    bbutton = this.add.sprite(600, 1320, 'b').setScale(2).setInteractive();
    upButton = this.add
      .sprite(260, 1150, 'UpButton')
      .setScale(1.5)
      .setInteractive();

    downButton = this.add
      .sprite(260, 1450, 'DownButton')
      .setScale(1.5)
      .setInteractive();
    leftButton = this.add
      .sprite(110, 1300, 'LeftButton')
      .setScale(1.5)
      .setInteractive();
    rightButton = this.add
      .sprite(410, 1300, 'RightButton')
      .setScale(1.5)
      .setInteractive();
    

      cam = this.cameras.main;
    cam.setBounds(0, 0, window.innerWidth, window.innerHeight);
      cam.setZoom(0.5);

    // gameScene.add.text( { font: "65px Arial", align: "center" }).setDepth(2).setOrigin(0.5, 0);

    cursors = this.input.keyboard.createCursorKeys();

    pacmanAnimInit();
    ghostsAnimInit();
    map = new Map();
    pacman = new Pacman(player);
    redGhost = new RedGhost();
    pinkGhost = new PinkGhost();
    blueGhost = new BlueGhost();
    orangeGhost = new OrangeGhost();
    this.enemyGroup.enableBody = true;
  
    this.physics.add.collider(player, this.pointsGroup, this.collectPoint);
    this.physics.add.collider(player, this.enemyGroup, this.enemyCollide);
    this.physics.add.overlap(player, this.fruitGroup, this.fruitCollide, null, this );
    this.physics.add.overlap(
      player,
      this.powerUpGroup,
      this.collectPowerUp,
      null,
      this
    );


    this.fruitSpawner()

  }
  player(_player: any) {
    throw new Error('Method not implemented.');
  }

  //************************************ UPDATE & BOUNDARIES  ************************************/
  update() {
    this.keys();
    pacman.update();
    this.boundaries();
    
    this.events.emit('updateEnemy');
    this.drawGui();
  }

  boundaries() {
    let nextTile = pacman.getNextTile();
    if (nextTile.type == 'WALL' || nextTile.type === 'DOOR') {
      if (pacman.direction() == 'EAST' || pacman.direction() == 'WEST')
        pacman.setRequestedDirection(
          Utils.findAlternativeWay('long', pacman.getCurrentTile())
        );
      if (pacman.direction() == 'NORTH' || pacman.direction() == 'SOUTH')
        pacman.setRequestedDirection(
          Utils.findAlternativeWay('lat', pacman.getCurrentTile())
        );
    }
  }
  

  //************************************ FRUIT SPAWNER  ************************************/
  fruitSpawner() {
    let self = this;

    if (!isFruit) {
      setTimeout(() => {
        if (shouldFruitSpawn) {
          fruitTile = map.getRandomAvailableTile('ANYWHERE');
          previousTileValue = fruitTile.getTileValue();

          fruitTile.setTileValue(5);
          isFruit = true;
        }
        self.fruitSpawner();
      }, FRUIT_SPAWN_TIMER);
    } else {
      setTimeout(() => {
        if (shouldFruitSpawn) {
          fruitTile.setTileValue(2);
          isFruit = false;
          if (fruitTile.fruit) fruitTile.fruit.destroy();
        }
        self.fruitSpawner();
      }, FRUIT_TIME);
    }
  }

  //************************************ COLLISIONS  ************************************/
// collect point phaser 3 function


collectPoint(player, point) {
  points += 10
  let pointOb = point.getData("TileObject");
  pointOb.setTileValue(2);
  this.dots++;
  point.disableBody(true, true);

  if (this.dots >= this.maxDots) {
    this.nextLevel();
  }
}
  collectPowerUp(_player: any, powerUp: { disableBody: (arg0: boolean, arg1: boolean) => void; }) {
    points += 20;
    this.events.emit('setGameMode', GameMode.FRIGHTENED);
    powerUp.disableBody(true, true);

    if (frigthenedTimer) clearTimeout(frigthenedTimer);
    frigthenedTimer = setTimeout(() => {
      this.events.emit('setGameMode', GameMode.CHASE);
    }, FRIGHTENED_TIME);
  }

  fruitCollide(_player: any, fruit: { getPoints: () => number; destroy: () => void; }) {
    points += fruit.getPoints();
    fruit.destroy();
  }

  enemyCollide(_player: any, enemy: { getData: (arg0: string) => any; }) {
    let enemyObj = enemy.getData('GhostObject');
    if (enemyObj.mode == GameMode.FRIGHTENED) {
      enemyObj.sentToCage(enemy);
    } else {
      if (pacman.isFree) this.GameOver();
    }
  }

  //************************************ KEYS  ************************************/
  keys() {
    if (cursors.left.isDown) pacman.setRequestedDirection(directionEnum.WEST);
    else if (cursors.right.isDown)
      pacman.setRequestedDirection(directionEnum.EAST);
    else if (cursors.up.isDown)
      pacman.setRequestedDirection(directionEnum.NORTH);
    else if (cursors.down.isDown)
      pacman.setRequestedDirection(directionEnum.SOUTH);
  }

  //************************************ GAME STATES ************************************/
  nextLevel() {
    level++;
    this.stopGame();
    this.restart();
  }

  GameOver() {
    level = 1;
    this.stopGame();
    this.drawGameOverScreen();
  }

  stopGame() {
    redGhost.freeze();
    pinkGhost.freeze();
    blueGhost.freeze();
    orangeGhost.freeze();
    pacman.isFree = false;
    shouldFruitSpawn = false;
    if (fruit != null) fruit.destroy();
  }

  restart() {
    //POINTS & MAP
    points = 0;
    this.maxDots = 0;
    this.dots = 0;
    map.destroy();
    map = new Map();
    //PLAYER RESET
    pacman.prepareForNextLevel();
    //ENEMIES REST
    redGhost.prepareNextLevel();
    pinkGhost.prepareNextLevel();
    blueGhost.prepareNextLevel();
    orangeGhost.prepareNextLevel();

    //FRUITS
    isFruit = false;
    shouldFruitSpawn = true;

    this.scene.resume();
  }

  //************************************ DRAWERS  ************************************/
  drawGui() {
    let pointsText = `Points: ${points}`;
    pointGUI.setText(pointsText);

    upButton.on('pointerdown', () => {
      pacman.setRequestedDirection(directionEnum.NORTH);
    });
    downButton.on('pointerdown', () => {
      pacman.setRequestedDirection(directionEnum.SOUTH);
    });
    leftButton.on('pointerdown', () => {
      pacman.setRequestedDirection(directionEnum.WEST);
    });
    rightButton.on('pointerdown', () => {
      pacman.setRequestedDirection(directionEnum.EAST);
    });
  }

  drawGameOverScreen() {
    let self = this;
    const MENU_GAMEOVER_WIDTH = 600;
    const MENU_GAMEOVER_HEIGHT = 350;
    const BUTTON_GAMEOVER_WIDTH = 326;
    const BUTTON_GAMEOVER_HEIGHT = 78;
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width /3 ;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height - 700;
    // Step 1: Create an array of sayings
    const gameOverSayings = [
      'WOMP WOMP!  You just got Nakad out bro.',
      'TRY AGAIN MFER!',
      'Try again!',
      'Never give up!',
      'Keep on trying!'
    ];
  
    // Step 2: Function to select a random saying from the list
    function getRandomSaying() {
      return gameOverSayings[Math.floor(Math.random() * gameOverSayings.length)];
    }
  
    // Step 3: Replace the existing image code with the new text code
    const gameOverText = this.add.text( screenCenterX, screenCenterY,
      getRandomSaying(),
      {fontFamily: 'digital-7', fontSize: '84px', fill: 'White', backgroundColor: '#7aa4fa',
   
      align: 'center',
			wordWrap: { width: 1 },
			fixedWidth: window.innerWidth /2 ,padding: { top: 100, bottom: 100, left: 20, right: 20 },
    }

    );
    gameOverText.setOrigin(0, 0);
    
    gameOverText.setDepth(5);
  
    btnRetry = this.add
      .image(
        300, 800,
        'GameoverButton'
      )
      .setOrigin(0, 0);
      btnRetry.setScale(0.5);
    btnRetry.setInteractive({ useHandCursor: true });
    btnRetry.on('pointerdown', () => {
      btnRetry.destroy();
      gameOverText.destroy(); // destroy the game over text
      btnRetry = null;
  
      self.restart();
    });
  
    btnRetry.setDepth(1);
  }
  

//************************************ CONFIG ************************************/
var config = {
  type: Phaser.AUTO,
  parent: 'game',
 
 
  backgroundColor: "#2f2f2f",
fps: {
  target: 60,
  forceSetTimeOut: true
},
 scale: {
    width: 475,
    height: 775,
    mode: Phaser.Scale.ScaleModes.NONE,
    // mode: Phaser.Scale.ScaleModes.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

   
  
 
  physics: {
   
    default: 'arcade',
    arcade: {

      debug: false,

      
      
    },
  },

  scene: GameScene,
};




export let game = new Phaser.Game(config);
game.scene.start('GameScene');
