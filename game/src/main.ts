import Phaser from 'phaser';
import { IslandScene } from './scenes/IslandScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  // 视口跟随窗口（Scale.RESIZE），地图 36×28 格独立于视口，由摄像机整数缩放呈现
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  backgroundColor: '#9bd4c3', // 与水面底色一致，边界处无色差
  pixelArt: true,
  roundPixels: true,
  scene: [IslandScene],
};

new Phaser.Game(config);
