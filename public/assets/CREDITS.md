# Imported free assets

The PNG atlases in this project were extracted from the original ZIP packages downloaded from Kenney. They are distributed under Creative Commons Zero (CC0 1.0).

Official license: https://creativecommons.org/publicdomain/zero/1.0/

## Farm tiles
- Files: `public/assets/tiles/farm/tilemap.png`, `tilemap_packed.png`
- Original pack: Kenney Tiny Farm v1.0
- Official source: https://kenney.nl/assets/tiny-farm
- Original license notice explicitly permits personal, educational and commercial use, with optional credit.

## Town tiles
- Files: `public/assets/tiles/town/tilemap.png`, `tilemap_packed.png`
- Original pack: Kenney Tiny Town v1.1
- Official source: https://kenney.nl/assets/tiny-town
- Original license notice explicitly permits personal, educational and commercial use, with optional credit.

## Pixel UI
- Files: `public/assets/ui/pixel-adventure/small-thin-packed.png`, `large-thin-packed.png`
- Original pack: Kenney UI Pack - Pixel Adventure (the ZIP's License.txt identifies version 2.0)
- Official source: https://kenney.nl/assets/ui-pack-pixel-adventure
- Original license notice explicitly permits personal, educational and commercial use, with optional credit.

## Important implementation notes
- Each `tilemap.png` and `tilemap_packed.png` is a separate layout; use the coordinates/layout for the specific atlas you load.
- The original ZIPs also include individual tile PNGs. We have imported only the atlas PNGs to keep the initial project lightweight.
- For pixel-perfect rendering in Phaser 3, use `pixelArt: true` and keep integer camera scaling.
- Do not automatically treat third-party Sprout Lands free assets as CC0: they have a different, more restrictive license.

Thanks to Kenney (https://kenney.nl) for making these assets available.
