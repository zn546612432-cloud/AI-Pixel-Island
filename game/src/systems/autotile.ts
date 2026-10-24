import { BLOB_TILES } from '../data/tileAtlas';

/** 邻接方向位：上=1 下=2 左=4 右=8（16 种基础邻接） */
export const enum Dir {
  UP = 1,
  DOWN = 2,
  LEFT = 4,
  RIGHT = 8,
}

/** 计算四邻 bitmask */
export function neighborMask(
  isSame: (x: number, y: number) => boolean,
  x: number,
  y: number
): number {
  let m = 0;
  if (isSame(x, y - 1)) m |= Dir.UP;
  if (isSame(x, y + 1)) m |= Dir.DOWN;
  if (isSame(x - 1, y)) m |= Dir.LEFT;
  if (isSame(x + 1, y)) m |= Dir.RIGHT;
  return m;
}

/** bitmask → blob 瓦片 (列,行)。16 种基础情况；内凹角当前退化为中心填充。 */
export function pickBlobTile(mask: number): { col: number; row: number } {
  return BLOB_TILES[mask] ?? BLOB_TILES[15];
}
