/**
 * 小岛地图数据 —— 字符画格式，可直接改字符来编辑地图。
 *
 * 地形层（36×28，每行 36 字符）：
 *   ~  海水（4 帧动画）
 *   g  浅绿草地（九宫 blob 自动瓦片）
 *   d  泥土（道路 / 农田，九宫 blob 自动瓦片）
 *
 * 装饰层（锚点 = 对象的"底左"格，多格对象向左上延伸）：
 *   .  空
 *   H  木屋（3×5，含烟囱）          T  大树（2×2）      t  高树（1×2）
 *   h  心形树（2×2）                b  浆果丛          B  灌木
 *   m  粉蘑菇                       M  紫蘑菇          r  石头    R  巨石
 *   s  树桩                         l  圆木            y  向日葵（1×2）
 *   o  黄花                         f  粉花            F  粉花小
 *   w  草芽                         x  白芽            k  农舍（3×3）
 *   c  麦苗                         C  成熟小麦        v  萝卜
 */

export const TERRAIN: string[] = [
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  '~~~~~~~~ggggggggggggggggggg~~~~~~~~~',
  '~~~~~ggggggggggggggggggggggggg~~~~~~',
  '~~~~gggggggggggggggggggggggggggg~~~~',
  '~~~ggggggggggggggggggggggggggggggg~~',
  '~~~gggggggggggggggggggggggggggggggg~',
  '~~~~ggggggggggggggggggggggggggggggg~',
  '~~~~gggggggggggggggggggggggggggggg~~',
  '~~~~~ggdggggggggggggggggggggggggg~~~',
  '~~~~~ggdggggggggdggggggggggggggg~~~~',
  '~~~~~~gdggggggggdgggggggggggggg~~~~~',
  '~~~~~~~dggggggggdggggggggggggg~~~~~~',
  '~~~~~~~~ggggggggdgggggggggggg~~~~~~~',
  '~~~~~~~ddddddddddddddddgggggg~~~~~~~',
  '~~~~~~ggggdgggggggggggdggggggg~~~~~~',
  '~~~~~gggggdgggggggggggdgggggggg~~~~~',
  '~~~~ggggggdgggggggggggdgggggggg~~~~~',
  '~~~~ggggggdgggggggggggdggggggg~~~~~~',
  '~~~~gddddddddggggggddddddgggg~~~~~~~',
  '~~~~gddddddddggggggddddddggg~~~gg~~~',
  '~~~~~ddddddddggggggddddddgg~~~~gg~~~',
  '~~~~~~dddddddgggggggggggg~~~~~~~~~~~',
  '~~~~~~~ddddddgggggggggg~~~~~~~~~~~~~',
  '~~~~~~~~dddddggggggggg~~~~~~~~~~~~~~',
  '~~~~~~~~~~ggggggggggg~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~ggggggggg~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~ggggggg~~~~~~~~~~~~~~~~~',
  '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
];

export const DECOR: string[] = [
  '....................................',
  '....................................',
  '....................................',
  '..........o..........t...T..........',
  '....w.................T.t.m.T..T....',
  '..........r..........T...T.t........',
  '....B....b............b.B...T.t..T..',
  '......H..............r.T...b..T.....',
  '.........F..o.........t.M.T..B.T....',
  '.....f.................t.r...Tm.....',
  '.............m...F....m..bt..b......',
  '..................r.....T...Mt......',
  '....................x..B...T........',
  '........................w.t.s.......',
  '....................................',
  '..............f.....................',
  '............M......b................',
  '.........w....k.....................',
  '....s...............................',
  '......CcvCcv......l.......R.........',
  '...................F.....mt.....b...',
  '......cCvcCv...........yB...........',
  '.............l........f.............',
  '....................................',
  '..............r.....................',
  '.................b..................',
  '....................................',
  '....................................',
];

/** 随机草皮散布的固定种子（刷新不变） */
export const SCATTER_SEED = 20261024;
