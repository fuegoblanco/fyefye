/** @format */

// You can write more code here
import preloadPackUrl from '../../static/assets/preload-asset-pack.json';
import assetPackUrl from '../../static/assets/asset-pack.json';

/* START OF COMPILED CODE */

import Phaser from 'phaser';
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

import AlignCanvas from '../components/AlignCanvas';
import PreloadText from '../components/PreloadText';
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

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');

    /* START-USER-CTR-CODE */
    // Write your code here.
    /* END-USER-CTR-CODE */
  }

  editorCreate(): void {
    // CanvasRef
    const canvasRef = this.add.image(480, 270, 'canvasIcon');
    canvasRef.visible = false;

    // guapen
    const guapen = this.add.image(480, 270, 'guapen');
    guapen.scaleX = 0.5;
    guapen.scaleY = 0.5;

    // progress
    const progress = this.add.text(480, 373, '', {});
    progress.setOrigin(0.5, 0.5);
    progress.text = '0%';
    progress.setStyle({ fontSize: '30px' });

    // canvasRef (components)
    new AlignCanvas(canvasRef);

    // progress (components)
    new PreloadText(progress);

    this.events.emit('scene-awake');
  }

  /* START-USER-CODE */

  // Write your code here

  preload() {
    this.editorCreate();

    this.load.pack('preload-asset-pack', preloadPackUrl);
    this.load.pack('asset-pack', assetPackUrl);

    this.load.on(Phaser.Loader.Events.COMPLETE, () =>
      this.scene.start('nakman')
    );
  }

  /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
