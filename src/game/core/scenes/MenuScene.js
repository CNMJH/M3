import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // 背景渐变
    const bg = this.add.rectangle(640, 360, 1280, 720, 0x1a1a2e);
    
    // 添加装饰网格
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x4a4a6a, 0.3);
    for (let i = 0; i < 1280; i += 40) {
      graphics.moveTo(i, 0);
      graphics.lineTo(i, 720);
    }
    for (let i = 0; i < 720; i += 40) {
      graphics.moveTo(0, i);
      graphics.lineTo(1280, i);
    }
    graphics.strokeRect(0, 0, 1280, 720);
    
    // 标题 - 带阴影
    const title = this.add.text(640, 150, 'M3 游戏', { 
      fontSize: 72, 
      fill: '#ffffff',
      fontStyle: 'bold',
      stroke: '#4a4a6a',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // 标题光晕效果
    this.tweens.add({
      targets: title,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // 副标题
    this.add.text(640, 220, '多人在线角色扮演游戏', {
      fontSize: 24,
      fill: '#888888'
    }).setOrigin(0.5);
    
    // 开始按钮
    const btn = this.add.text(640, 350, '▶ 开始游戏', {
      fontSize: 36,
      backgroundColor: '#4a4a6a',
      padding: { x: 40, y: 20 },
      borderRadius: 15
    }).setOrigin(0.5);
    
    btn.setInteractive({ useHandCursor: true });
    
    btn.on('pointerover', () => {
      btn.setStyle({ backgroundColor: '#6a6a8a' });
      btn.setScale(1.1);
    });
    
    btn.on('pointerout', () => {
      btn.setStyle({ backgroundColor: '#4a4a6a' });
      btn.setScale(1);
    });
    
    btn.on('pointerdown', () => {
      console.log('🎮 开始游戏');
      this.scene.start('GameScene');
    });
    
    // 按钮光晕
    this.tweens.add({
      targets: btn,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // 操作说明
    const controls = [
      '【WASD】移动角色',
      '【QWER】释放技能',
      '【靠近怪物】自动战斗'
    ];
    
    controls.forEach((text, index) => {
      this.add.text(640, 450 + index * 35, text, {
        fontSize: 18,
        fill: '#aabbcc',
        backgroundColor: '#2a2a4a',
        padding: { x: 15, y: 8 }
      }).setOrigin(0.5);
    });
    
    // 版本信息
    this.add.text(640, 680, 'v0.1.0 | Day 1 - 核心功能', {
      fontSize: 14,
      fill: '#666666'
    }).setOrigin(0.5);
  }
}

export default MenuScene;
