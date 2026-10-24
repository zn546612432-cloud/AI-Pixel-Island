import Phaser from 'phaser';
import { TILE, ZOOM, COLS, ROWS } from './constants';
import { TestScene } from './scenes/TestScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: COLS * TILE * ZOOM, // 20 x 16 x 2 = 640
  height: ROWS * TILE * ZOOM, // 15 x 16 x 2 = 480
  backgroundColor: '#ff00ff',
  pixelArt: true,
  roundPixels: true,
  scene: [TestScene],
};

new Phaser.Game(config);
