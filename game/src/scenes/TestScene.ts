import Phaser from 'phaser';

/**
 * 第一阶段测试场景：只验证 Phaser 框架能正常启动并渲染。
 * 成功标志：浏览器中出现一块品红色 (#ff00ff) 画布。
 * 后续场景（地图、角色、AI 居民）会替换本场景。
 */
export class TestScene extends Phaser.Scene {
  constructor() {
    super('TestScene');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 16, 'AI Pixel Island', {
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(width / 2, height / 2 + 24, 'Phase 1: Phaser OK (#ff00ff)', {
        fontSize: '16px',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0.5);
  }
}
