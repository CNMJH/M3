import Phaser from 'phaser';
import MapSystem from '../systems/mapSystem.js';
import Player from '../entities/player.js';
import CombatSystem from '../systems/combatSystem.js';
import MainUI from '../ui/mainUI.js';
import Network from '../systems/network.js';

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init() {
    this.mapSystem = new MapSystem(this);
    this.combatSystem = new CombatSystem(this);
    this.ui = new MainUI(this);
    this.network = new Network(this);
  }

  create() {
    console.log('===== GameScene 创建 =====');
    
    // 创建地图
    this.map = this.mapSystem.createMap();
    
    // 计算中心点
    const cx = this.map.width * this.map.tileWidth / 2;
    const cy = this.map.height * this.map.tileHeight / 2;
    
    // 创建玩家
    this.player = new Player(this, cx, cy);
    console.log(`✅ 玩家创建完成 (${cx}, ${cy})`);
    
    // 添加游戏提示
    this.addGameHints();
    
    // 注册玩家到战斗系统
    this.combatSystem.registerPlayer(this.player);
    
    // 生成怪物
    const monsters = this.mapSystem.spawnDemoMonsters();
    monsters.forEach(m => this.combatSystem.registerMonster(m));
    
    // 初始化碰撞
    this.mapSystem.initCollisions(this.player);
    this.combatSystem.initCombatCollisions(this.player);
    
    // 创建 UI
    this.ui.createUI();
    
    // 连接网络
    this.network.connect();
    
    console.log('===== GameScene 初始化完成 =====');
  }

  addGameHints() {
    // 左上角 - 目标提示
    const hintBg = this.add.rectangle(150, 120, 280, 100, 0x000000, 0.7);
    hintBg.setOrigin(0, 0);
    
    this.add.text(20, 125, '🎯 游戏目标', {
      fontSize: 16,
      fill: '#ffffff',
      fontStyle: 'bold'
    });
    
    const hints = [
      '• 击败哥布林大王',
      '• 等待撤离点开放',
      '• 收集资源变强'
    ];
    
    hints.forEach((text, i) => {
      this.add.text(20, 150 + i * 22, text, {
        fontSize: 14,
        fill: '#aabbcc'
      });
    });
  }

  update(time, delta) {
    if (this.player) this.player.update();
    if (this.network) this.network.update();
    if (this.ui) this.ui.update(this.player);
  }

  shutdown() {
    console.log('GameScene 关闭');
    if (this.mapSystem) this.mapSystem.cleanup();
    if (this.combatSystem) this.combatSystem.cleanup();
  }
}

export default GameScene;
