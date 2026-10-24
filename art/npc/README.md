# NPC 居民美术

3 个原创像素 NPC 居民 —— Mika（蓝裙少女）/ Gus（绿衣农夫）/ Oma（暖色婆婆）。

- 规格：48×48 帧，透明背景，四方向 ×（待机 + 4 帧行走）= 20 帧/角色，脚底基线统一在帧内 y31
- 绘制方式：pixel-art-studio（MIT，见 `PIXELSTUDIO_LICENSE`）+ Pillow，纯代码确定性绘制，逐像素可控
- 画风：配色与 chibi 比例**参考** Sprout Lands（Cup Nooble），**造型与每一个像素均为原创**，非素材包拷贝
- 授权：本目录 NPC 精灵为原创作品；Sprout Lands 素材包本身**未包含**在此仓库（其 License 禁止再分发素材包）

文件：
- `game/public/assets/characters/{mika,gus,oma}_sheet.png` — 20 帧透明精灵表（游戏运行时资源）
- `art/npc/npc_build.py` — 构建脚本（确定性、可复现；加新居民只需往 `RESIDENTS` 加一行配色）
- `art/npc/pixelstudio.py` — 随附的绘制引擎（MIT，来源 Gamezxz/pixel-art-studio）
- `art/npc/preview.html` — 自包含动画预览

重新生成（需 Python + Pillow）：

```bash
python art/npc/npc_build.py
```
