import Phaser from 'phaser';

class CombatSystem {
  constructor(scene) {
    this.scene = scene;
    this.player = null;
    this.monsters = [];
    this.attackCooldown = false;
    this.attackCooldownTime = 500; // 0.5 秒攻击间隔
  }

  registerPlayer(p) {
    this.player = p;
  }
  
  registerMonster(m) {
    this.monsters.push(m);
  }

  initCombatCollisions(player) {
    // 移除撞击自动攻击 - 改为按键主动攻击
    console.log('✅ 战斗系统初始化完成（空格键攻击）');
  }
  
  // 玩家主动攻击（空格键）
  playerAttack(player) {
    // 攻击冷却
    if (this.attackCooldown) return;
    this.attackCooldown = true;
    this.scene.time.delayedCall(this.attackCooldownTime, () => {
      this.attackCooldown = false;
    });
    
    // 查找范围内的怪物
    let hitCount = 0;
    this.monsters.forEach(m => {
      if (!m.active) return;
      
      const dist = Phaser.Math.Distance.Between(player.x, player.y, m.x, m.y);
      if (dist < 80) { // 攻击范围 80 像素
        const damage = player.stats.atk;
        m.takeDamage(damage);
        this.createAttackEffect(m.x, m.y);
        hitCount++;
      }
    });
    
    if (hitCount > 0) {
      console.log(`⚔️ 攻击命中 ${hitCount} 个怪物`);
    }
  }
  
  createAttackEffect(x, y) {
    // 简单的攻击闪光效果
    const flash = this.scene.add.circle(x, y, 20, 0xffffff, 0.5);
    this.scene.tweens.add({
      targets: flash,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });
  }
  
  cleanup() {
    this.monsters.forEach(m => {
      if (m.destroy) m.destroy();
    });
    this.monsters = [];
  }
}

export default CombatSystem;
