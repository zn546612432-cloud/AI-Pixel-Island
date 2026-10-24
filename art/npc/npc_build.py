#!/usr/bin/env python3
"""Sprout Lands 风格 NPC 居民构建脚本（pixel-art-studio）。

锁定的画风（来自 study.py 分析）：
- 7 色、无黑描边（用 outfit 深色当暗部/轮廓）
- 奶油肤 #f3f2c0 / 亮部 #ddd5de，粉耳 #e8b5ac/#f3d8c5，黄点缀 #eae178
- 紧凑 chibi：down 视图约 14×16，48×48 帧居中，脚底基线 y=31（所有帧一致）

每个居民：4 方向 × (待机 + 4 帧行走) = 20 帧。
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # 同目录 vendored pixelstudio.py
from pixelstudio import Sprite
from PIL import Image

W = H = 48

# 共享色
SKIN = "#f3f2c0"
SKIN_L = "#ddd5de"
PINK = "#e8b5ac"
PINK_L = "#f3d8c5"
YEL = "#eae178"

RESIDENTS = {
    "mika": ("#4a5a9e", "#6b7dc0", "#8b9cd4"),   # 蓝裙少女
    "gus":  ("#4a6b3a", "#6b8a52", "#88a06a"),   # 绿衣农夫
    "oma":  ("#8a5040", "#b07a5a", "#cc8a68"),   # 暖色婆婆
}

def pal(out, main, light):
    return [out, main, light, SKIN, SKIN_L, PINK, PINK_L, YEL]

# 行走姿态：水平摆脚，脚底基线恒为 y31
# down/up 用 (左 dx, 右 dx)；side 用 (前 dx, 后 dx)
POSES = [(0, 0), (-1, 1), (0, 0), (1, -1)]


def draw_down(s, pose, OUT, MAIN, LIGHT, back=False):
    ldx, rdx = POSES[pose]
    # 鞋（暗，基线 y30-31，与裙底分离）
    s.rect(20 + ldx, 30, 22 + ldx, 31, OUT)
    s.rect(25 + rdx, 30, 27 + rdx, 31, OUT)
    # 手臂（先画，压身体下）
    s.rect(17, 26, 18, 28, MAIN)
    s.rect(29, 26, 30, 28, MAIN)
    # 身体：深色底 + 主色上移1 → 右下暗边
    s.ellipse(19, 25, 28, 29, OUT)
    s.ellipse(19, 24, 27, 28, MAIN)
    s.ellipse(21, 25, 26, 27, LIGHT, only=MAIN)
    # 头：深色底 + 肤色上移
    s.ellipse(18, 18, 29, 25, OUT)
    s.ellipse(18, 17, 28, 24, SKIN)
    s.ellipse(20, 18, 26, 20, SKIN_L, only=SKIN)
    # 短兔耳
    s.rect(20, 15, 21, 18, OUT)
    s.rect(26, 15, 27, 18, OUT)
    s.rect(20, 16, 21, 17, PINK)
    s.rect(26, 16, 27, 17, PINK)
    if back:
        s.ellipse(20, 19, 27, 24, MAIN, only=SKIN)  # 后脑头发块
    else:
        s.px(22, 21, OUT); s.px(25, 21, OUT)        # 眼
        s.px(20, 22, PINK); s.px(27, 22, PINK)      # 腮红
        s.px(23, 23, OUT); s.px(24, 23, OUT)        # 嘴


def draw_side(s, pose, OUT, MAIN, LIGHT):
    fdx, bdx = POSES[pose]
    # 腿（暗，基线 y30-31）
    s.rect(18 + bdx, 30, 20 + bdx, 31, OUT)
    s.rect(27 + fdx, 30, 29 + fdx, 31, OUT)
    # 身体：深色+主色
    s.ellipse(18, 25, 29, 29, OUT)
    s.ellipse(18, 24, 28, 28, MAIN)
    s.ellipse(20, 25, 26, 27, LIGHT, only=MAIN)
    # 手臂
    s.rect(22, 26, 24, 28, MAIN)
    # 头：深色+肤色（前伸）
    s.ellipse(21, 18, 31, 25, OUT)
    s.ellipse(21, 17, 30, 24, SKIN)
    s.ellipse(23, 18, 28, 20, SKIN_L, only=SKIN)
    # 单耳
    s.rect(25, 15, 26, 18, OUT)
    s.rect(25, 16, 26, 17, PINK)
    # 脸（右侧）
    s.px(29, 21, OUT)   # 眼
    s.px(27, 22, PINK)  # 腮红


def build_resident(name, cols):
    OUT, MAIN, LIGHT = cols
    sprites = {}
    for kind in ("down", "up", "left", "right"):
        s = Sprite(W, H, palette=pal(OUT, MAIN, LIGHT))
        for f in range(5):
            if f:
                s.add_frame(copy=False)
                s.use(frame=f + 1)
            pose = 0 if f in (0, 1) else f - 1
            if kind == "down":
                draw_down(s, pose, OUT, MAIN, LIGHT)
            elif kind == "up":
                draw_down(s, pose, OUT, MAIN, LIGHT, back=True)
            elif kind == "right":
                draw_side(s, pose, OUT, MAIN, LIGHT)
            else:
                draw_side(s, pose, OUT, MAIN, LIGHT)
                im = s._img()
                im.paste(im.transpose(Image.FLIP_LEFT_RIGHT), (0, 0))
        sprites[kind] = s
    return sprites


# ---- 颜色映射 ASCII（用于目检） ----
COLOR_LETTER = {}  # 动态按 palette 索引
def ascii_frame(s, frame=1):
    im = s.composite(frame)
    b = im.getbbox()
    if not b:
        return "(empty)"
    px = im.load()
    # 从调色板建立颜色→字母映射
    pal = s._palette if hasattr(s, "_palette") else None
    out = []
    for yy in range(b[1], b[3] + 1):
        row = ""
        for xx in range(b[0], b[2] + 1):
            r, g, bb, a = px[xx, yy]
            if a < 128:
                row += "."
            else:
                row += hexcolor(r, g, bb)
        out.append(row)
    return "\n".join(out)

def hexcolor(r, g, bb):
    # 颜色→单字符：肤、亮、暗、粉、黄
    if (r, g, bb) == (243, 242, 192): return "o"  # skin
    if (r, g, bb) == (221, 213, 222): return "."  # skin light
    if (r, g, bb) == (232, 181, 172): return "p"  # pink
    if (r, g, bb) == (243, 216, 197): return "p"  # pink light
    if (r, g, bb) == (234, 225, 120): return "y"  # yellow
    # 居民色：把最暗→@，主→#，亮→*（按亮度排序）
    return classify(r, g, bb)

def classify(r, g, bb):
    lum = 0.299 * r + 0.587 * g + 0.114 * bb
    if lum < 100: return "@"
    if lum < 165: return "#"
    return "*"


if __name__ == "__main__":
    import base64, json
    OUTDIR = os.path.dirname(os.path.abspath(__file__))
    DIRS = ("down", "up", "left", "right")
    DNAME = {"down": "朝下", "up": "朝上", "left": "朝左", "right": "朝右"}
    all_sheets = {}
    for name, cols in RESIDENTS.items():
        sp = build_resident(name, cols)
        # 20 帧表：5 列(待机+4行走) × 4 行(down,up,left,right)
        sheet = Image.new("RGBA", (W * 5, H * 4), (0, 0, 0, 0))
        for r, kind in enumerate(DIRS):
            for c in range(5):
                sheet.paste(sp[kind].composite(c + 1), (c * W, r * H))
        sheet.save(f"{OUTDIR}/{name}_sheet.png")
        sheet.resize((sheet.width * 6, sheet.height * 6), Image.NEAREST).save(f"{OUTDIR}/{name}_contact_6x.png")
        # 四方向行走 GIF（帧2..5 = 行走）
        from PIL import ImageDraw
        for kind in DIRS:
            frames = [sp[kind].composite(f) for f in (2, 3, 4, 5)]
            gz = 6
            imgs = []
            for f in frames:
                bg = Image.new("RGBA", (W * gz, H * gz), (0, 0, 0, 0))
                bd = ImageDraw.Draw(bg)
                for yy in range(0, H * gz, 12):
                    for xx in range(0, W * gz, 12):
                        if ((xx // 12) + (yy // 12)) % 2 == 0:
                            bd.rectangle([xx, yy, xx + 11, yy + 11], fill=(38, 38, 54, 255))
                bg.alpha_composite(f.resize((W * gz, H * gz), Image.NEAREST), (0, 0))
                imgs.append(bg.convert("RGB"))
            imgs[0].save(f"{OUTDIR}/{name}_walk_{kind}.gif", save_all=True, append_images=imgs[1:], duration=160, loop=0)
        # 锚点自检
        for kind in DIRS:
            b = sp[kind].composite(1).getbbox()
            print(f"  {name}/{kind}: bbox={b}  feet_bottom={b[3]}  (期望 31)")
        all_sheets[name] = base64.b64encode(open(f"{OUTDIR}/{name}_sheet.png", "rb").read()).decode()

    # 自包含预览页
    cards = "\n".join(
        f'<div class="cell" data-name="{n}"><h3>{n}</h3><canvas id="c-{n}"></canvas>'
        f'<div class="ctl"><button class="on" data-m="idle">待机</button>'
        f'<button data-m="walk">行走</button></div></div>' for n in RESIDENTS)
    html = f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>NPC 居民预览</title>
<style>:root{{color-scheme:dark}} body{{margin:0;padding:20px;background:#14141e;color:#e8e8f0;font-family:"Microsoft YaHei",sans-serif}}
h1{{font-size:20px}} .sub{{color:#9a9ab0;font-size:13px;margin:2px 0 16px}}
.row{{display:flex;flex-wrap:wrap;gap:18px}}
.cell{{background:#1d1d2b;border:1px solid #33334a;border-radius:8px;padding:12px;text-align:center}}
.cell h3{{margin:0 0 6px;font-size:15px}}
canvas{{image-rendering:pixelated;background:repeating-conic-gradient(#1c1c2a 0 25%,#23233a 0 50%) 0 0/24px 24px;border-radius:4px}}
.ctl button{{margin:8px 3px 0;padding:3px 10px;font-size:12px;border:1px solid #555;border-radius:5px;background:#2a2a3a;color:#ddd;cursor:pointer}}
.ctl button.on{{background:#ff7ac8;color:#14141e}}
.note{{margin-top:18px;color:#9a9ab0;font-size:12px;line-height:1.7;max-width:900px}}</style></head><body>
<h1>NPC 居民 · 四方向 待机/行走</h1>
<div class="sub">48×48 帧 · 透明背景 · NEAREST 整数像素 · 脚底基线 y31（红线） · 配色沿用 Sprout Lands 7 色</div>
<div class="row">{cards}</div>
<div class="note">每个角色 5 列 = 待机(站立) + 4 帧行走，4 行 = 朝下/朝上/朝左/朝右。红色横线为帧内脚底基线 y31。</div>
<script>
const SHEETS = {json.dumps(all_sheets)};
const F=48, Z=4, SZ=F*Z;
for (const [n, b64] of Object.entries(SHEETS)) {{
  const cv = document.getElementById('c-'+n); cv.width=SZ; cv.height=SZ;
  const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled=false;
  const img = new Image(); img.onload = () => {{
    let mode='idle', t0=performance.now(), dir=0;
    const D=[['down',0],['up',1],['left',2],['right',3]];
    const draw=(fc)=>{{ ctx.clearRect(0,0,SZ,SZ); ctx.fillStyle='rgba(255,70,70,.55)'; ctx.fillRect(0,(31-1)*Z,SZ,Z);
      ctx.drawImage(img, fc*F, D[dir][1]*F, F, F, 0, 0, SZ, SZ); }};
    const loop=(t)=>{{ if(mode==='idle') draw(0); else {{ const k=Math.floor((t-t0)/160)%4; draw(1+k); }} requestAnimationFrame(loop); }};
    requestAnimationFrame(loop);
    cv.parentElement.querySelectorAll('button').forEach(b=>b.onclick=()=>{{
      cv.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); mode=b.dataset.m; t0=performance.now(); }});
    cv.parentElement.addEventListener('dblclick', ()=>{{ dir=(dir+1)%4; }});
  }};
  img.src='data:image/png;base64,'+b64;
}}
</script></body></html>'''
    open(f"{OUTDIR}/npc-preview.html", "w", encoding="utf-8").write(html)
    print("preview written:", f"{OUTDIR}/npc-preview.html")
