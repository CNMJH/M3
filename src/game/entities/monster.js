import Phaser from 'phaser';

class Monster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type, config, texture = 'monster-red') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;

    this.type = type;
    this.config = config;
    this.stats = { ...config };
    
    // 根据类型设置大小
    const size = type === 'goblinKing' ? 40 : 24;
    this.body.setSize(size, size);
    this.type = 'monster';
    
    // 显示名称
    this.nameText = scene.add.text(x, y - 20, config.name, {
      fontSize: 14,
      fill: '#ff0000',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // 血条背景
    const barWidth = type === 'goblinKing' ? 48 : 32;
    this.hpBarBg = scene.add.rectangle(x, y - 10, barWidth, 4, 0x333333);
    // 血条
    this.hpBar = scene.add.rectangle(x, y - 10, barWidth, 4, 0xff0000);
    
    this.updatePosition(x, y);
    
    // 怪物 AI
    if (type === 'goblin') {
      this.setupGoblinAI();
    } else if (type === 'goblinKing') {
      this.setupKingAI(x, y);
    }
  }
  
  updatePosition(x, y) {
    this.setPosition(x, y);
    if (this.nameText) this.nameText.setPosition(x, y - 20);
    if (this.hpBarBg) this.hpBarBg.setPosition(x, y - 10);
    if (this.hpBar) this.hpBar.setPosition(x, y - 10);
  }
  
  setupGoblinAI() {
    // 随机巡逻
    this.scene.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => {
        if (!this.active) return;
        const dir = Phaser.Math.Between(0, 3);
        let vx = 0, vy = 0;
        if (dir === 0) vy = -this.config.speed;
        else if (dir === 1) vx = this.config.speed;
        else if (dir === 2) vy = this.config.speed;
        else vx = -this.config.speed;
        
        this.body.velocity.x = vx;
        this.body.velocity.y = vy;
        
        // 2 秒后停止
        this.scene.time.delayedCall(1000, () => {
          if (!this.active) return;
          this.body.velocity.x = 0;
          this.body.velocity.y = 0;
        });
      }
    });
    
    // 每帧更新血条位置
    this.scene.events.on('update', () => {
      if (this.active && this.body) {
        this.updatePosition(this.x, this.y);
      }
    });
  }
  
  setupKingAI(startX, startY) {
    // 定点巡逻
    const patrol = () => {
      if (!this.active) return;
      const tx = startX + Phaser.Math.Between(-100, 100);
      const ty = startY + Phaser.Math.Between(-100, 100);
      this.scene.physics.moveTo(this, tx, ty, this.config.speed);
      this.scene.time.delayedCall(3000, patrol);
    };
    patrol();
    
    // 每帧更新血条位置
    this.scene.events.on('update', () => {
      if (this.active && this.body) {
        this.updatePosition(this.x, this.y);
      }
    });
  }
  
  takeDamage(amount) {
    const actualDamage = Math.max(1, amount);
    this.stats.hp -= actualDamage;
    
    // 更新血条
    const hpPercent = this.stats.hp / this.stats.maxHp;
    this.hpBar.setScale(hpPercent, 1);
    this.hpBar.setOrigin(0, 0.5);
    
    console.log(`👾 ${this.config.name} 受到伤害：${actualDamage} (剩余：${this.stats.hp}/${this.stats.maxHp})`);
    
    if (this.stats.hp <= 0) {
      this.die();
    }
  }
  
  die() {
    console.log(`💀 ${this.config.name} 死亡`);
    this.setActive(false);
    this.setVisible(false);
    this.nameText.destroy();
    this.hpBarBg.destroy();
    this.hpBar.destroy();
    
    // 生成掉落物
    this.spawnLoot();
  }
  
  spawnLoot() {
    const dropTable = this.config.drop;
    if (!dropTable) return;
    
    const drops = [];
    
    // 遍历掉落表
    Object.entries(dropTable).forEach(([itemId, chance]) => {
      if (Math.random() <= chance) {
        drops.push(itemId);
      }
    });
    
    // 创建掉落物
    drops.forEach(itemId => {
      const x = this.x + Phaser.Math.Between(-20, 20);
      const y = this.y + Phaser.Math.Between(-20, 20);
      this.scene.createDropItem(itemId, x, y);
    });
    
    // 给予经验值
    if (this.config.exp) {
      this.scene.giveExp(this.config.exp);
    }
  }
  
  destroy() {
    if (this.nameText) this.nameText.destroy();
    if (this.hpBarBg) this.hpBarBg.destroy();
    if (this.hpBar) this.hpBar.destroy();
    super.destroy();
  }
}

export default Monster;
