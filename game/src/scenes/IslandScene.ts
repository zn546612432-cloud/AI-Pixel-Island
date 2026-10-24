import Phaser from 'phaser';
import { WATER_FRAME_MS } from '../constants';
import { TEXTURES } from '../data/tileAtlas';
import { attachCameraControls } from '../systems/cameraControls';
import { buildMap } from '../systems/mapRenderer';

/** 正式小岛地图场景（第二阶段：地图 + 摄像机） */
export class IslandScene extends Phaser.Scene {
  constructor() {
    super('IslandScene');
  }

  preload(): void {
    for (const s of TEXTURES.sheets) {
      this.load.spritesheet(s.key, s.url, { frameWidth: s.frameW, frameHeight: s.frameH });
    }
    for (const i of TEXTURES.images) {
      this.load.image(i.key, i.url);
    }
  }

  create(): void {
    const layers = buildMap(this);

    // 水面 4 帧循环（250ms/帧）
    let frame = 0;
    this.time.addEvent({
      delay: WATER_FRAME_MS,
      loop: true,
      callback: () => {
        frame = (frame + 1) % 4;
        layers.updateWater(frame);
      },
    });

    attachCameraControls(this);
  }
}
