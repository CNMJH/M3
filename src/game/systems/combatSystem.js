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
    // 玩家与怪物碰撞时自动攻击
    this.scene.physics.add.overlap(player, this.monsters, (p, m) => {
      if (m.active && p.active) {
        this.attack(p, m);
      }
    });
    
    console.log('✅ 战斗碰撞初始化完成');
  }

  attack(attacker, target) {
    // 攻击冷却
    if (this.attackCooldown) return;
    this.attackCooldown = true;
    this.scene.time.delayedCall(this.attackCooldownTime, () => {
      this.attackCooldown = false;
    });
    
    // 伤害计算
    let damage;
    if (attacker.type === 'monster') {
      // 怪物攻击玩家
      damage = attacker.stats.atk;
      target.takeDamage(damage);
    } else {
      // 玩家攻击怪物
      damage = attacker.stats.atk;
      target.takeDamage(damage);
      
      // 攻击特效
      this.createAttackEffect(target.x, target.y);
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
