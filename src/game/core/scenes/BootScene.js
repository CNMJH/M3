import Phaser from 'phaser';

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // 加载玩家图片（使用色块替代，后期替换）
    const graphics = this.make.graphics();
    
    // 玩家 - 绿色方块
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('player-green', 32, 32);
    graphics.clear();
    
    // 玩家 - 蓝色方块（P2）
    graphics.fillStyle(0x0000ff, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('player-blue', 32, 32);
    graphics.clear();
    
    // 怪物 - 红色方块
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('monster-red', 32, 32);
    graphics.clear();
    
    // 草地地砖
    graphics.fillStyle(0x2d5016, 1);
    graphics.fillRect(0, 0, 16, 16);
    graphics.lineStyle(1, 0x3d6026, 0.5);
    graphics.strokeRect(0, 0, 16, 16);
    graphics.generateTexture('grass-tile', 16, 16);
    graphics.clear();
    
    // 采集物
    graphics.fillStyle(0x00ff00, 1); // 草药 - 绿色
    graphics.fillCircle(8, 8, 6);
    graphics.generateTexture('herb', 16, 16);
    graphics.clear();
    
    graphics.fillStyle(0x888888, 1); // 矿石 - 灰色
    graphics.fillRect(2, 2, 28, 28);
    graphics.generateTexture('ore', 32, 32);
    graphics.clear();
    
    graphics.fillStyle(0x8B4513, 1); // 木材 - 棕色
    graphics.fillRect(4, 0, 24, 32);
    graphics.generateTexture('wood', 32, 32);
    graphics.clear();
    
    // 撤离点
    graphics.fillStyle(0x00ffff, 1);
    graphics.lineStyle(2, 0x00ffff, 1);
    graphics.strokeRect(0, 0, 32, 32);
    graphics.generateTexture('exit', 32, 32);
    graphics.clear();
    
    // 加载配置文件
    this.load.json('monsterConfig', 'src/game/assets/config/monsterConfig.json');
    this.load.json('equipmentConfig', 'src/game/assets/config/equipmentConfig.json');
  }

  create() {
    console.log('✅ 资源加载完成');
    this.scene.start('MenuScene');
  }
}

export default BootScene;
