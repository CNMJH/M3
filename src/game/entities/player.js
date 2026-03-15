import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player-green');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;

    this.setCollideWorldBounds(true);
    this.body.setSize(24, 24);
    this.speed = 160;

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    this.equipConfig = scene.cache.json.get('equipmentConfig');

    // 基础属性
    this.base = { maxHp: 500, hp: 500, maxMp: 200, mp: 200, atk: 40, def: 25 };
    this.stats = { ...this.base };

    // 装备槽
    this.equipment = { weapon: null, helmet: null, chest: null, boots: null };
    
    // 技能（每个玩家独立）
    this.skills = { q: null, w: null, e: null, r: null, d: null };
    
    // 技能冷却
    this.skillCooldowns = { q: 0, w: 0, e: 0, r: 0, d: 0 };

    this.initKeys();
  }

  initKeys() {
    const keys = ['Q', 'W', 'E', 'R', 'D'];
    keys.forEach(k => {
      this.scene.input.keyboard.on(`keydown-${k.toLowerCase()}`, () => {
        this.cast(k.toLowerCase());
      });
    });
  }

  equip(id) {
    const item = this.equipConfig[id];
    if (!item) return;
    const slot = item.slot;
    this.equipment[slot] = item;
    this.refreshStats();
    this.refreshSkills();
    console.log(`✅ 装备 ${item.name}`);
  }

  refreshStats() {
    this.stats = { ...this.base };
    Object.values(this.equipment).forEach(it => {
      if (!it || !it.stats) return;
      Object.entries(it.stats).forEach(([k, v]) => {
        if (this.stats[k] !== undefined) this.stats[k] += v;
      });
    });
  }

  refreshSkills() {
    // 深拷贝，避免共享引用
    this.skills = { q: null, w: null, e: null, r: null, d: null };
    Object.values(this.equipment).forEach(it => {
      if (it?.skills) {
        Object.entries(it.skills).forEach(([key, skill]) => {
          this.skills[key] = { ...skill }; // 深拷贝技能
        });
      }
    });
  }

  cast(key) {
    const skill = this.skills[key];
    if (!skill) {
      console.log(`⚠️ 技能 ${key} 未装备`);
      return;
    }
    
    // 检查冷却
    const now = Date.now();
    if (now < this.skillCooldowns[key]) {
      console.log(`⏰ 技能冷却中`);
      return;
    }
    
    // 检查 MP
    const cost = skill.cost || 0;
    if (this.stats.mp < cost) {
      console.log(`❌ MP 不足 (需要${cost})`);
      return;
    }
    
    // 消耗 MP
    this.stats.mp -= cost;
    
    // 设置冷却（2 秒）
    this.skillCooldowns[key] = now + 2000;
    
    console.log(`✨ 释放技能：${skill.name} (消耗 MP: ${cost})`);
  }

  takeDamage(amount) {
    const actualDamage = Math.max(1, amount - this.stats.def * 0.5);
    this.stats.hp -= actualDamage;
    console.log(`💔 受到伤害：${actualDamage.toFixed(1)} (剩余 HP: ${this.stats.hp}/${this.stats.maxHp})`);
    
    if (this.stats.hp <= 0) {
      this.die();
    }
  }

  die() {
    console.log('💀 玩家死亡');
    this.setActive(false);
    this.setVisible(false);
    
    // 死亡惩罚：掉落部分物品
    this.dropInventoryOnDeath();
    
    // 3 秒后复活
    this.scene.time.delayedCall(3000, () => {
      this.stats.hp = this.stats.maxHp;
      this.stats.mp = this.stats.maxMp;
      this.setPosition(400, 360);
      this.setActive(true);
      this.setVisible(true);
      console.log('✅ 玩家复活');
    });
  }
  
  dropInventoryOnDeath() {
    if (!this.inventory) return;
    
    // 计算掉落比例（30% 几率掉落每个物品）
    const dropRate = 0.3;
    let droppedCount = 0;
    
    Object.entries(this.inventory).forEach(([itemId, count]) => {
      if (count > 0 && Math.random() < dropRate) {
        const dropCount = Math.floor(count * 0.5); // 掉落一半
        if (dropCount > 0) {
          // 在玩家位置附近创建掉落物
          const x = this.x + Phaser.Math.Between(-30, 30);
          const y = this.y + Phaser.Math.Between(-30, 30);
          
          for (let i = 0; i < Math.min(dropCount, 3); i++) {
            this.scene.createDropItem(itemId, x + i * 20, y);
          }
          
          this.inventory[itemId] -= dropCount;
          droppedCount += dropCount;
        }
      }
    });
    
    if (droppedCount > 0) {
      console.log(`💸 死亡掉落：${droppedCount} 个物品`);
      
      // 显示死亡提示
      const text = this.scene.add.text(this.x, this.y - 80, '💀 死亡掉落物品！', {
        fontSize: 20,
        fill: '#ff0000',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);
      
      this.scene.time.delayedCall(2000, () => text.destroy());
    }
  }

  update() {
    if (!this.body || !this.active) return;
    
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.body.velocity.x = -this.speed;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.body.velocity.x = this.speed;
    }
    
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.body.velocity.y = -this.speed;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.body.velocity.y = this.speed;
    }
  }
}

export default Player;
