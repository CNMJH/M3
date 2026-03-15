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
    // 玩家与怪物碰撞时自动攻击（玩家攻击怪物）
    this.scene.physics.add.overlap(player, this.monsters, (p, m) => {
      if (m.active && p.active) {
        // 玩家攻击怪物
        this.playerAttack(p, m);
      }
    });
    
    // 怪物主动攻击玩家
    this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.monsters.forEach(m => {
          if (!m.active) return;
          
          // 检查怪物是否在玩家附近（200 像素内）
          const dist = this.scene.physics.distanceBetween(player, m);
          if (dist < 200 && player.active) {
            this.monsterAttack(m, player);
          }
        });
      }
    });
    
    console.log('✅ 战斗碰撞初始化完成');
  }

  playerAttack(attacker, target) {
    // 攻击冷却
    if (this.attackCooldown) return;
    this.attackCooldown = true;
    this.scene.time.delayedCall(this.attackCooldownTime, () => {
      this.attackCooldown = false;
    });
    
    // 伤害计算
    const damage = attacker.stats.atk;
    target.takeDamage(damage);
    
    // 攻击特效
    this.createAttackEffect(target.x, target.y);
  }
  
  monsterAttack(attacker, target) {
    // 怪物攻击冷却（1 秒一次）
    if (attacker.attackCooldown) return;
    attacker.attackCooldown = true;
    
    // 伤害计算
    const damage = attacker.stats.atk;
    target.takeDamage(damage);
    
    console.log(`👾 ${attacker.config.name} 攻击玩家，造成 ${damage} 点伤害`);
    
    // 1 秒后可以再次攻击
    this.scene.time.delayedCall(1000, () => {
      attacker.attackCooldown = false;
    });
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
