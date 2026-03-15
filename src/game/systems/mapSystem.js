import Phaser from 'phaser';
import Monster from '../entities/monster.js';

class MapSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentRegion = 'green';
    this.tileSize = 16;
    this.mapWidth = 50;
    this.mapHeight = 50;
    this.collectionPoints = [];
    this.exitPoints = [];
    this.timers = [];
    this.groundLayer = null;

    this.monsterConfig = this.scene.cache.json.get('monsterConfig');
  }

  createMap() {
    // 填充背景色
    this.scene.cameras.main.setBackgroundColor('#1a3009');
    
    // 创建地图
    const map = this.scene.make.tilemap({
      width: this.mapWidth,
      height: this.mapHeight,
      tileWidth: this.tileSize,
      tileHeight: this.tileSize
    });

    // 添加 tileset
    const tileset = map.addTilesetImage('grass-tile');
    
    // 创建空白图层
    const ground = map.createBlankLayer('Ground', tileset);
    
    // 填充整个地图为草地（使用 tile index 0）
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        ground.putTileAt(0, x, y);
      }
    }
    
    ground.setCollisionByExclusion([-1]);
    this.groundLayer = ground;

    // 添加地图边界
    this.createMapBorders();

    console.log(`✅ 地图创建完成：${this.mapWidth}x${this.mapHeight}`);

    this.addCollectionPoints();
    this.addExitPoints();
    this.startExitTimer();

    return map;
  }

  createMapBorders() {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(4, 0x4a4a6a, 1);
    graphics.strokeRect(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize);
    
    // 四个角标记
    graphics.fillStyle(0x4a4a6a, 1);
    graphics.fillRect(0, 0, 8, 8);
    graphics.fillRect(this.mapWidth * this.tileSize - 8, 0, 8, 8);
    graphics.fillRect(0, this.mapHeight * this.tileSize - 8, 8, 8);
    graphics.fillRect(this.mapWidth * this.tileSize - 8, this.mapHeight * this.tileSize - 8, 8, 8);
  }

  addCollectionPoints() {
    const list = [
      { type: 'herb', count: 5, key: 'herb' },
      { type: 'ore', count: 3, key: 'ore' },
      { type: 'wood', count: 4, key: 'wood' }
    ];

    list.forEach(({ type, count, key }) => {
      for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(10, 40) * this.tileSize;
        const y = Phaser.Math.Between(10, 40) * this.tileSize;
        const s = this.scene.physics.add.staticSprite(x, y, key);
        s.setData('type', type);
        this.collectionPoints.push(s);
      }
    });
    
    console.log(`✅ 采集点创建完成：${this.collectionPoints.length} 个`);
  }

  addExitPoints() {
    const pos = [
      { x: 5 * this.tileSize, y: 5 * this.tileSize },
      { x: 45 * this.tileSize, y: 45 * this.tileSize }
    ];

    pos.forEach(p => {
      const e = this.scene.physics.add.staticSprite(p.x, p.y, 'exit');
      e.setVisible(false);
      e.setData('active', false);
      e.setSize(32, 32);
      this.exitPoints.push(e);
    });
    
    console.log(`✅ 撤离点创建完成：${this.exitPoints.length} 个`);
  }

  startExitTimer() {
    // 60 秒后开放撤离点
    const t1 = setTimeout(() => {
      this.toggleExit(true);
      
      // 10 分钟后关闭
      const loop = setInterval(() => {
        this.toggleExit(false);
        
        // 8 分钟后再次开放
        const t2 = setTimeout(() => {
          this.toggleExit(true);
        }, 8 * 60 * 1000);
        this.timers.push(t2);
      }, 10 * 60 * 1000);
      this.timers.push(loop);
    }, 60 * 1000);
    this.timers.push(t1);
    
    console.log('✅ 撤离点定时器启动（60 秒后开放）');
  }

  toggleExit(show) {
    this.exitPoints.forEach(e => {
      e.setVisible(show);
      if (show) {
        this.scene.tweens.add({
          targets: e,
          alpha: 0.5,
          duration: 500,
          yoyo: true,
          repeat: -1
        });
      } else {
        this.scene.tweens.killTweensOf(e);
        e.setAlpha(1);
      }
    });

    const msg = show ? '🟢 撤离点已开放' : '🔴 撤离点已关闭';
    const txt = this.scene.add.text(640, 100, msg, {
      fontSize: 24,
      backgroundColor: show ? '#00aa00' : '#aa0000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5);
    
    this.scene.time.delayedCall(3000, () => txt.destroy());
  }

  spawnDemoMonsters() {
    const monsters = [];
    
    // 3 只小哥布林
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(15, 35) * this.tileSize;
      const y = Phaser.Math.Between(15, 35) * this.tileSize;
      monsters.push(this.spawnMonster('goblin', x, y));
    }
    
    // 1 只哥布林大王（中心位置）
    const kx = 25 * this.tileSize;
    const ky = 25 * this.tileSize;
    monsters.push(this.spawnMonster('goblinKing', kx, ky));
    
    console.log(`✅ 怪物生成完成：${monsters.length} 只`);
    return monsters;
  }

  spawnMonster(type, x, y) {
    const cfg = this.monsterConfig[type];
    
    // 哥布林大王使用特殊纹理
    const texture = type === 'goblinKing' ? 'monster-king' : 'monster-red';
    const m = new Monster(this.scene, x, y, type, cfg, texture);
    return m;
  }

  initCollisions(player) {
    // 玩家与地图边界碰撞
    this.scene.physics.add.collider(player, this.groundLayer);
    console.log('✅ 地图碰撞初始化完成');
  }
  
  cleanup() {
    // 清理所有定时器
    this.timers.forEach(t => {
      clearTimeout(t);
      clearInterval(t);
    });
    this.timers = [];
  }
}

export default MapSystem;
