import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // 背景
    this.add.rectangle(640, 360, 1280, 720, 0x1a1a2e);
    
    // 标题
    this.add.text(640, 200, 'M3 游戏', { 
      fontSize: 64, 
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // 开始按钮
    const btn = this.add.text(640, 400, '▶ 开始游戏', {
      fontSize: 32,
      backgroundColor: '#4a4a6a',
      padding: { x: 30, y: 15 },
      borderRadius: 10
    }).setOrigin(0.5);
    
    btn.setInteractive({ useHandCursor: true });
    
    btn.on('pointerover', () => {
      btn.setStyle({ backgroundColor: '#6a6a8a' });
    });
    
    btn.on('pointerout', () => {
      btn.setStyle({ backgroundColor: '#4a4a6a' });
    });
    
    btn.on('pointerdown', () => {
      console.log('🎮 开始游戏');
      this.scene.start('GameScene');
    });
    
    // 说明文字
    this.add.text(640, 500, 'WASD 移动 | QWER 技能 | 靠近怪物自动战斗', {
      fontSize: 18,
      fill: '#888888'
    }).setOrigin(0.5);
  }
}

export default MenuScene;
