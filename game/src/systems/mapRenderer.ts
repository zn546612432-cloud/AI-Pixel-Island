import Phaser from 'phaser';
import { COLS, MAP_H, MAP_W, ROWS, TILE } from '../constants';
import { DECOR, SCATTER_SEED, TERRAIN } from '../data/islandMap';
import { DECOR_DEFS, FRAME_COLS, SCATTER_PROBABILITY, SCATTER_TILES } from '../data/tileAtlas';
import { neighborMask, pickBlobTile } from './autotile';
import { mulberry32 } from './rng';

export interface MapLayers {
  /** 重绘水面动画帧（0~3），由场景定时调用 */
  updateWater(frame: number): void;
  /** 装饰对象（已按脚底 y 排深度，供未来角色 y-sort 复用） */
  decorImages: Phaser.GameObjects.Image[];
}

type CellSet = Set<number>;
const cellKey = (x: number, y: number) => y * COLS + x;

function cellsOf(ch: string): CellSet {
  const s: CellSet = new Set();
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (TERRAIN[y][x] === ch) s.add(cellKey(x, y));
    }
  }
  return s;
}

/** 装饰占用的格子（含多格对象的延伸范围），散布装饰需避开 */
function occupiedCells(): CellSet {
  const s: CellSet = new Set();
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const ch = DECOR[y][x];
      if (ch === '.') continue;
      const def = DECOR_DEFS[ch];
      if (!def) continue;
      const tw = Math.ceil(def.sw / TILE);
      const th = Math.ceil(def.sh / TILE);
      for (let dy = 0; dy < th; dy++) {
        for (let dx = 0; dx < tw; dx++) {
          s.add(cellKey(x + dx, y - th + 1 + dy));
        }
      }
    }
  }
  return s;
}

/** 把源图的矩形区域注册为独立纹理（多格装饰用） */
function makeCroppedTextures(scene: Phaser.Scene): void {
  for (const [ch, def] of Object.entries(DECOR_DEFS)) {
    if (def.sw === TILE && def.sh === TILE) continue; // 单格装饰直接用 spritesheet 帧
    const name = `decor-${ch}`;
    if (scene.textures.exists(name)) continue;
    const src = scene.textures.get(def.key).getSourceImage() as HTMLImageElement;
    const canvasTex = scene.textures.createCanvas(name, def.sw, def.sh);
    canvasTex?.context.drawImage(src, def.sx, def.sy, def.sw, def.sh, 0, 0, def.sw, def.sh);
    canvasTex?.refresh();
  }
}

/** 构建全部地图图层。返回可更新句柄。 */
export function buildMap(scene: Phaser.Scene): MapLayers {
  makeCroppedTextures(scene);

  const waterCells = cellsOf('~');
  const grassCells = cellsOf('g');
  const dirtCells = cellsOf('d');

  // Layer 0：水面（动画，由场景每 250ms 调 updateWater）
  const waterRT = scene.add.renderTexture(0, 0, MAP_W, MAP_H).setOrigin(0, 0).setDepth(0);
  const waterCols = FRAME_COLS.water;
  const updateWater = (frame: number) => {
    waterRT.clear();
    for (const key of waterCells) {
      const x = key % COLS;
      const y = Math.floor(key / COLS);
      waterRT.stamp('water', frame % waterCols, x * TILE, y * TILE);
    }
  };
  updateWater(0);

  // Layer 2：浅绿草地（九宫 blob）
  const grassRT = scene.add.renderTexture(0, 0, MAP_W, MAP_H).setOrigin(0, 0).setDepth(1);
  const isGrass = (x: number, y: number) => grassCells.has(cellKey(x, y));
  for (const key of grassCells) {
    const x = key % COLS;
    const y = Math.floor(key / COLS);
    const { col, row } = pickBlobTile(neighborMask(isGrass, x, y));
    grassRT.stamp('grass', row * FRAME_COLS.grass + col, x * TILE, y * TILE);
  }

  // Layer 1/5：泥土（道路+农田，九宫 blob，画在草地上层）
  const dirtRT = scene.add.renderTexture(0, 0, MAP_W, MAP_H).setOrigin(0, 0).setDepth(2);
  const isDirt = (x: number, y: number) => dirtCells.has(cellKey(x, y));
  for (const key of dirtCells) {
    const x = key % COLS;
    const y = Math.floor(key / COLS);
    const { col, row } = pickBlobTile(neighborMask(isDirt, x, y));
    dirtRT.stamp('dirt', row * FRAME_COLS.dirt + col, x * TILE, y * TILE);
  }

  // Layer 3：深绿草地 —— 本阶段以固定种子的草芽/小花散布呈现（见报告）
  const scatterRT = scene.add.renderTexture(0, 0, MAP_W, MAP_H).setOrigin(0, 0).setDepth(3);
  const occupied = occupiedCells();
  const rng = mulberry32(SCATTER_SEED);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!isGrass(x, y) || occupied.has(cellKey(x, y))) continue;
      if (rng() >= SCATTER_PROBABILITY) continue;
      const pick = SCATTER_TILES[Math.floor(rng() * SCATTER_TILES.length)];
      scatterRT.stamp('grass', pick.row * FRAME_COLS.grass + pick.col, x * TILE, y * TILE);
    }
  }

  // Layer 6：植物与建筑（Image 对象，深度=脚底行，未来 y-sort 直接复用）
  const decorImages: Phaser.GameObjects.Image[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const ch = DECOR[y][x];
      if (ch === '.') continue;
      const def = DECOR_DEFS[ch];
      if (!def) continue;
      let img: Phaser.GameObjects.Image;
      if (def.sw === TILE && def.sh === TILE) {
        const frameCol = Math.floor(def.sx / TILE);
        const frameRow = Math.floor(def.sy / TILE);
        const cols = def.key === 'things' ? 9 : def.key === 'plants' ? 6 : FRAME_COLS.grass;
        img = scene.add.image(x * TILE, (y + 1) * TILE, def.key, frameRow * cols + frameCol);
      } else {
        img = scene.add.image(x * TILE, (y + 1) * TILE, `decor-${ch}`);
      }
      img.setOrigin(0, 1).setDepth(y + 1);
      decorImages.push(img);
    }
  }

  return { updateWater, decorImages };
}
