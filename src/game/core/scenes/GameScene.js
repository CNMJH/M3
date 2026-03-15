import Phaser from 'phaser';
import MapSystem from '../../systems/mapSystem.js';
import Player from '../../entities/player.js';
import CombatSystem from '../../systems/combatSystem.js';
import MainUI from '../../ui/mainUI.js';
import Network from '../../systems/network.js';

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
    
    // 初始化掉落物系统
    this.initDropSystem();
    
    // 初始化采集系统
    this.initCollectionSystem();
    
    console.log('===== GameScene 初始化完成 =====');
  }

  initDropSystem() {
    this.droppedItems = [];
    console.log('✅ 掉落物系统初始化完成');
  }
  
  createDropItem(itemId, x, y) {
    const graphics = this.make.graphics();
    
    // 根据物品 ID 生成不同颜色的掉落物
    let color = 0xffff00; // 默认金色
    let size = 16;
    
    if (itemId === 'coin') {
      color = 0xffd700; // 金币 - 金色
    } else if (itemId === 'herb') {
      color = 0x00ff00; // 草药 - 绿色
    } else if (itemId === 'sword') {
      color = 0x888888; // 剑 - 银色
      size = 20;
    }
    
    graphics.fillStyle(color, 1);
    graphics.fillCircle(size/2, size/2, size/2);
    graphics.generateTexture(`drop_${itemId}`, size, size);
    graphics.clear();
    
    const item = this.physics.add.sprite(x, y, `drop_${itemId}`);
    item.setData('itemId', itemId);
    item.setData('type', 'loot');
    item.setImmovable(true);
    item.body.allowGravity = false;
    item.setCircle(size/2);
    
    // 添加发光效果
    this.tweens.add({
      targets: item,
      alpha: 0.8,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
    
    this.droppedItems.push(item);
    console.log(`🎁 创建掉落物：${itemId} (${x}, ${y})`);
  }
  
  giveExp(amount) {
    if (!this.player) return;
    
    // 显示获得经验提示
    const expText = this.add.text(this.player.x, this.player.y - 30, `+${amount} EXP`, {
      fontSize: 18,
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    // 向上飘动并消失
    this.tweens.add({
      targets: expText,
      y: expText.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => expText.destroy()
    });
    
    // 更新玩家经验
    if (!this.player.exp) this.player.exp = 0;
    if (!this.player.level) this.player.level = 1;
    if (!this.player.expToNext) this.player.expToNext = 100;
    
    this.player.exp += amount;
    console.log(`✨ 获得经验：${amount} (总计：${this.player.exp}/${this.player.expToNext})`);
    
    // 检查升级
    this.checkLevelUp();
  }
  
  checkLevelUp() {
    if (!this.player || this.player.exp < this.player.expToNext) return;
    
    // 升级
    this.player.level++;
    this.player.exp -= this.player.expToNext;
    this.player.expToNext = Math.floor(this.player.expToNext * 1.5);
    
    // 属性提升
    this.player.base.maxHp += 50;
    this.player.base.maxMp += 20;
    this.player.base.atk += 5;
    this.player.base.def += 3;
    
    // 恢复 HP/MP
    this.player.stats.hp = this.player.stats.maxHp;
    this.player.stats.mp = this.player.stats.maxMp;
    
    console.log(`🎉 升级！当前等级：${this.player.level}`);
    
    // 显示升级提示
    const levelText = this.add.text(640, 360, `🎉 升级到 ${this.player.level} 级！`, {
      fontSize: 32,
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 6,
      backgroundColor: '#8b0000',
      padding: { x: 30, y: 15 }
    }).setOrigin(0.5);
    
    this.time.delayedCall(2000, () => levelText.destroy());
  }
  
  initCollectionSystem() {
    // 监听玩家与采集物的碰撞
    this.physics.add.overlap(this.player, this.mapSystem.collectionPoints, (player, item) => {
      if (!item.visible) return;
      
      const type = item.getData('type');
      this.collectItem(type, item);
    });
    
    // 监听玩家与掉落物的碰撞（自动拾取）
    this.physics.add.overlap(this.player, this.droppedItems, (player, item) => {
      if (!item.visible) return;
      
      const itemId = item.getData('itemId');
      this.pickupItem(itemId, item);
    });
    
    // 设置掉落物与玩家的碰撞检测
    this.droppedItems.forEach(item => {
      if (item.body) {
        item.body.checkCollision.none = false;
        item.body.checkCollision.up = false;
        item.body.checkCollision.down = false;
        item.body.checkCollision.left = false;
        item.body.checkCollision.right = false;
      }
    });
    
    // 监听玩家与撤离点的碰撞
    this.physics.add.overlap(this.player, this.mapSystem.exitPoints, (player, exit) => {
      if (!exit.active || !exit.visible) return;
      
      this.tryExit(player, exit);
    });
    
    console.log('✅ 采集系统初始化完成');
  }
  
  collectItem(type, item) {
    // 禁用采集物
    item.disableBody(true, true); // true = 从物理世界移除，true = 从显示列表移除
    item.setVisible(false);
    
    // 显示获得提示
    const icons = {
      herb: '🌿',
      ore: '🪨',
      wood: '🪵'
    };
    const names = {
      herb: '草药',
      ore: '矿石',
      wood: '木材'
    };
    
    const icon = icons[type] || '📦';
    const name = names[type] || type;
    
    const text = this.add.text(this.player.x, this.player.y - 50, `${icon} 获得 ${name}`, {
      fontSize: 18,
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: text,
      y: text.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy()
    });
    
    // 添加到背包
    if (!this.player.inventory) this.player.inventory = {};
    if (!this.player.inventory[type]) this.player.inventory[type] = 0;
    this.player.inventory[type]++;
    
    console.log(`🎒 采集 ${name} (总计：${this.player.inventory[type]})`);
  }
  
  pickupItem(itemId, item) {
    // 禁用掉落物
    item.disableBody(true, false);
    
    // 显示获得提示
    const icons = {
      coin: '💰',
      herb: '🌿',
      sword: '⚔️'
    };
    const names = {
      coin: '金币',
      herb: '草药',
      sword: '铁剑'
    };
    
    const icon = icons[itemId] || '📦';
    const name = names[itemId] || itemId;
    
    const text = this.add.text(this.player.x, this.player.y - 50, `${icon} 获得 ${name}`, {
      fontSize: 18,
      fill: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: text,
      y: text.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy()
    });
    
    // 添加到背包
    if (!this.player.inventory) this.player.inventory = {};
    if (!this.player.inventory[itemId]) this.player.inventory[itemId] = 0;
    this.player.inventory[itemId]++;
    
    console.log(`🎒 拾取 ${name} (总计：${this.player.inventory[itemId]})`);
  }
  
  tryExit(player, exit) {
    console.log('🚪 玩家尝试撤离');
    
    // 显示撤离提示
    const exitText = this.add.text(640, 360, '🚪 撤离成功！', {
      fontSize: 36,
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 6,
      backgroundColor: '#006400',
      padding: { x: 40, y: 20 }
    }).setOrigin(0.5);
    
    this.time.delayedCall(2000, () => {
      exitText.destroy();
      // 重置玩家位置
      player.setPosition(400, 360);
      player.stats.hp = player.stats.maxHp;
      player.stats.mp = player.stats.maxMp;
      console.log('✅ 玩家已撤离并复活');
    });
  }

  addGameHints() {
    // 左上角 - 目标提示
    const hintBg = this.add.rectangle(150, 140, 280, 120, 0x000000, 0.7);
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
    
    // 操作提示
    this.add.text(20, 230, '【空格键】攻击', {
      fontSize: 14,
      fill: '#ffcc00',
      fontStyle: 'bold'
    });
  }

  update(time, delta) {
    if (this.player) this.player.update();
    if (this.network) this.network.update();
    if (this.ui) this.ui.update(this.player);
    
    // 手动检测掉落物拾取（更可靠）
    if (this.player && this.player.active) {
      this.droppedItems.forEach(item => {
        if (!item.visible) return;
        
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          item.x,
          item.y
        );
        
        if (dist < 30) { // 拾取范围 30 像素
          const itemId = item.getData('itemId');
          this.pickupItem(itemId, item);
        }
      });
    }
  }

  shutdown() {
    console.log('GameScene 关闭');
    if (this.mapSystem) this.mapSystem.cleanup();
    if (this.combatSystem) this.combatSystem.cleanup();
  }
}

export default GameScene;
