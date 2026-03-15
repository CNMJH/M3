import Phaser from 'phaser';

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const graphics = this.make.graphics();
    
    // 玩家 - 带眼睛的绿色方块（更像角色）
    graphics.fillStyle(0x00cc00, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(10, 12, 4); // 左眼白
    graphics.fillCircle(22, 12, 4); // 右眼白
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(10, 12, 2); // 左眼珠
    graphics.fillCircle(22, 12, 2); // 右眼珠
    graphics.generateTexture('player-green', 32, 32);
    graphics.clear();
    
    // 玩家 2 - 蓝色角色
    graphics.fillStyle(0x0066cc, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(10, 12, 4);
    graphics.fillCircle(22, 12, 4);
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(10, 12, 2);
    graphics.fillCircle(22, 12, 2);
    graphics.generateTexture('player-blue', 32, 32);
    graphics.clear();
    
    // 怪物 - 红色带角的方块
    graphics.fillStyle(0xcc0000, 1);
    graphics.fillRect(0, 4, 32, 28);
    graphics.fillStyle(0x660000, 1);
    graphics.fillTriangle(4, 4, 8, 0, 12, 4); // 左角
    graphics.fillTriangle(20, 4, 24, 0, 28, 4); // 右角
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(10, 14, 4); // 左眼
    graphics.fillCircle(22, 14, 4); // 右眼
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(10, 14, 2);
    graphics.fillCircle(22, 14, 2);
    graphics.generateTexture('monster-red', 32, 32);
    graphics.clear();
    
    // 草地地砖 - 带纹理
    graphics.fillStyle(0x2d5016, 1);
    graphics.fillRect(0, 0, 16, 16);
    graphics.fillStyle(0x3d6026, 1);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if ((i + j) % 2 === 0) {
          graphics.fillRect(i * 4, j * 4, 4, 4);
        }
      }
    }
    graphics.lineStyle(1, 0x1a3009, 0.5);
    graphics.strokeRect(0, 0, 16, 16);
    graphics.generateTexture('grass-tile', 16, 16);
    graphics.clear();
    
    // 草药 - 绿色小植物
    graphics.fillStyle(0x228B22, 1);
    graphics.fillRect(6, 8, 4, 8); // 茎
    graphics.fillStyle(0x32CD32, 1);
    graphics.fillCircle(8, 6, 4); // 顶部
    graphics.fillCircle(4, 8, 3); // 左叶
    graphics.fillCircle(12, 8, 3); // 右叶
    graphics.generateTexture('herb', 16, 16);
    graphics.clear();
    
    // 矿石 - 灰色石头
    graphics.fillStyle(0x808080, 1);
    graphics.fillCircle(16, 16, 14);
    graphics.fillStyle(0xA0A0A0, 1);
    graphics.fillCircle(12, 12, 6);
    graphics.fillStyle(0x606060, 1);
    graphics.fillCircle(20, 18, 5);
    graphics.generateTexture('ore', 32, 32);
    graphics.clear();
    
    // 木材 - 棕色树干
    graphics.fillStyle(0x8B4513, 1);
    graphics.fillRect(8, 0, 16, 32);
    graphics.fillStyle(0xA0522D, 1);
    graphics.fillRect(10, 4, 4, 24);
    graphics.fillStyle(0x654321, 1);
    graphics.fillRect(8, 8, 16, 2);
    graphics.fillRect(8, 20, 16, 2);
    graphics.generateTexture('wood', 32, 32);
    graphics.clear();
    
    // 撤离点 - 发光传送门
    graphics.lineStyle(3, 0x00ffff, 1);
    graphics.strokeRect(2, 2, 28, 28);
    graphics.lineStyle(2, 0x00ffff, 0.5);
    graphics.strokeRect(6, 6, 20, 20);
    graphics.fillStyle(0x00ffff, 0.3);
    graphics.fillRect(4, 4, 24, 24);
    graphics.generateTexture('exit', 32, 32);
    graphics.clear();
    
    // 哥布林大王 - 更大的红色怪物
    graphics.fillStyle(0x990000, 1);
    graphics.fillRect(0, 4, 48, 44);
    graphics.fillStyle(0xff0000, 1);
    graphics.fillTriangle(4, 4, 10, -8, 16, 4);
    graphics.fillTriangle(32, 4, 38, -8, 44, 4);
    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(14, 18, 6);
    graphics.fillCircle(34, 18, 6);
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(14, 18, 3);
    graphics.fillCircle(34, 18, 3);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(16, 32, 16, 4); // 牙齿
    graphics.generateTexture('monster-king', 48, 48);
    graphics.clear();
    
    this.load.json('monsterConfig', 'src/game/assets/config/monsterConfig.json');
    this.load.json('equipmentConfig', 'src/game/assets/config/equipmentConfig.json');
  }

  create() {
    console.log('✅ 资源加载完成');
    this.scene.start('MenuScene');
  }
}

export default BootScene;
