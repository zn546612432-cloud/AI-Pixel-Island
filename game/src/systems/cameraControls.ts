import Phaser from 'phaser';
import { CAMERA_PAN_SPEED, MAP_H, MAP_W, ZOOM } from '../constants';

/**
 * 摄像机控制：
 * - 边界锁定在地图范围内，任何缩放下都不会露出画布底色
 * - 整数倍缩放，且保证地图覆盖整个视口（不允许把整图压缩到一屏）
 * - 桌面：WASD/方向键平移 + 鼠标拖动；手机：单指拖动
 */
export function attachCameraControls(scene: Phaser.Scene): void {
  const cam = scene.cameras.main;
  cam.setBounds(0, 0, MAP_W, MAP_H);

  const applyZoom = () => {
    // 至少 ZOOM 倍；视口大于地图时取能覆盖地图的最小整数倍
    const z = Math.max(
      ZOOM,
      Math.ceil(scene.scale.width / MAP_W),
      Math.ceil(scene.scale.height / MAP_H)
    );
    cam.setZoom(z);
  };
  applyZoom();
  scene.scale.on('resize', applyZoom);

  // 指针拖动（桌面鼠标 + 手机单指）
  scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
    if (!p.isDown) return;
    cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
    cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
  });

  // 键盘平移
  const keys = scene.input.keyboard?.addKeys('W,A,S,D,UP,LEFT,DOWN,RIGHT') as
    | Record<string, Phaser.Input.Keyboard.Key>
    | undefined;
  scene.events.on(Phaser.Scenes.Events.UPDATE, (_time: number, delta: number) => {
    if (!keys) return;
    const d = (CAMERA_PAN_SPEED * delta) / 1000 / cam.zoom;
    if (keys.A?.isDown || keys.LEFT?.isDown) cam.scrollX -= d;
    if (keys.D?.isDown || keys.RIGHT?.isDown) cam.scrollX += d;
    if (keys.W?.isDown || keys.UP?.isDown) cam.scrollY -= d;
    if (keys.S?.isDown || keys.DOWN?.isDown) cam.scrollY += d;
  });
}
