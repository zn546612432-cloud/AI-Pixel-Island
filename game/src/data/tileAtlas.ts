/**
 * Sprout Lands 素材坐标映射表 —— 全部来自 calibration.html 的标定结果。
 * 禁止凭记忆猜测，改动前先在标定页核对 (列,行)。
 */

/** 九宫 blob 瓦片映射：bitmask（上=1 下=2 左=4 右=8）→ 草地/泥土表的 (列,行)。
 *  Grass.png 与 Tilled_Dirt_v2.png 同构：3×3 团块 + 竖条 + 横条 + 独立圆块。 */
export const BLOB_TILES: Readonly<Record<number, { col: number; row: number }>> = {
  0: { col: 3, row: 3 }, // 独立
  1: { col: 3, row: 2 }, // 仅上邻 → 竖条下端
  2: { col: 3, row: 0 }, // 仅下邻 → 竖条上端
  3: { col: 3, row: 1 }, // 上下 → 竖条中段
  4: { col: 2, row: 3 }, // 仅左邻 → 横条右端
  8: { col: 0, row: 3 }, // 仅右邻 → 横条左端
  12: { col: 1, row: 3 }, // 左右 → 横条中段
  5: { col: 2, row: 2 }, // 上+左 → 右下角
  9: { col: 0, row: 2 }, // 上+右 → 左下角
  6: { col: 2, row: 0 }, // 下+左 → 右上角
  10: { col: 0, row: 0 }, // 下+右 → 左上角
  7: { col: 2, row: 1 }, // 上+下+左 → 右边缘
  11: { col: 0, row: 1 }, // 上+下+右 → 左边缘
  13: { col: 1, row: 2 }, // 上+左+右 → 下边缘
  14: { col: 1, row: 0 }, // 下+左+右 → 上边缘
  15: { col: 1, row: 1 }, // 四邻 → 中心填充
};

/** 纹理帧列数（16px spritesheet 切帧后，帧号 = row*cols+col） */
export const FRAME_COLS = {
  grass: 11, // Grass.png 176×112
  dirt: 11, // Tilled_Dirt_v2.png 176×112
  water: 4, // Water.png 64×16
} as const;

/** 散布装饰瓦片（草地表，底色与填充 #c0d470 一致，已验证零接缝。
 *  只用细小的草芽与小花——大块浅斑(3,5)/(4,5)在路口处观感突兀，已剔除 */
export const SCATTER_TILES: ReadonlyArray<{ col: number; row: number }> = [
  { col: 0, row: 5 }, { col: 0, row: 5 }, { col: 0, row: 5 },
  { col: 1, row: 5 }, { col: 1, row: 5 },
  { col: 2, row: 5 }, { col: 2, row: 5 },
  { col: 0, row: 6 }, { col: 0, row: 6 },
  { col: 1, row: 6 }, { col: 1, row: 6 },
  { col: 2, row: 6 },
  { col: 5, row: 5 }, { col: 5, row: 5 },
  { col: 5, row: 6 },
];

export const SCATTER_PROBABILITY = 0.085;

/** 装饰对象定义：源图 + 源矩形（像素），锚点=底左 */
export interface DecorDef {
  key: string; // 源纹理 key
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export const DECOR_DEFS: Readonly<Record<string, DecorDef>> = {
  T: { key: 'things', sx: 16, sy: 0, sw: 32, sh: 32 },
  t: { key: 'things', sx: 0, sy: 0, sw: 16, sh: 32 },
  h: { key: 'things', sx: 48, sy: 0, sw: 32, sh: 32 },
  b: { key: 'things', sx: 0, sy: 48, sw: 16, sh: 16 },
  B: { key: 'things', sx: 16, sy: 48, sw: 16, sh: 16 },
  m: { key: 'things', sx: 80, sy: 0, sw: 16, sh: 16 },
  M: { key: 'things', sx: 112, sy: 0, sw: 16, sh: 16 },
  r: { key: 'things', sx: 112, sy: 16, sw: 16, sh: 16 },
  R: { key: 'things', sx: 128, sy: 16, sw: 16, sh: 16 },
  s: { key: 'things', sx: 48, sy: 32, sw: 16, sh: 16 },
  l: { key: 'things', sx: 80, sy: 32, sw: 16, sh: 16 },
  y: { key: 'things', sx: 128, sy: 32, sw: 16, sh: 32 },
  o: { key: 'things', sx: 112, sy: 32, sw: 16, sh: 16 },
  f: { key: 'things', sx: 112, sy: 48, sw: 16, sh: 16 },
  F: { key: 'things', sx: 96, sy: 48, sw: 16, sh: 16 },
  w: { key: 'grass', sx: 0, sy: 80, sw: 16, sh: 16 },
  x: { key: 'grass', sx: 16, sy: 80, sw: 16, sh: 16 },
  v: { key: 'plants', sx: 64, sy: 16, sw: 16, sh: 16 },
  c: { key: 'plants', sx: 16, sy: 0, sw: 16, sh: 16 },
  C: { key: 'plants', sx: 64, sy: 0, sw: 16, sh: 16 },
  k: { key: 'chicken_house', sx: 0, sy: 0, sw: 48, sh: 48 },
  H: { key: 'wooden_house', sx: 0, sy: 0, sw: 48, sh: 80 },
};

/** 纹理资源清单 */
export const TEXTURES = {
  sheets: [
    { key: 'grass', url: 'assets/sprout-lands/tilesets/grass.png', frameW: 16, frameH: 16 },
    { key: 'dirt', url: 'assets/sprout-lands/tilesets/tilled_dirt.png', frameW: 16, frameH: 16 },
    { key: 'water', url: 'assets/sprout-lands/tilesets/water.png', frameW: 16, frameH: 16 },
    { key: 'things', url: 'assets/sprout-lands/objects/grass_biome_things.png', frameW: 16, frameH: 16 },
    { key: 'plants', url: 'assets/sprout-lands/objects/plants.png', frameW: 16, frameH: 16 },
  ],
  images: [
    { key: 'wooden_house', url: 'assets/sprout-lands/tilesets/wooden_house.png' },
    { key: 'chicken_house', url: 'assets/sprout-lands/objects/chicken_house.png' },
  ],
} as const;
