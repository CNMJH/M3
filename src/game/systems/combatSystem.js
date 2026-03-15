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
    
    // 获取玩家朝向（根据最后移动方向）
    const facing = {
      x: player.body.velocity.x !== 0 ? Math.sign(player.body.velocity.x) : 0,
      y: player.body.velocity.y !== 0 ? Math.sign(player.body.velocity.y) : 1
    };
    
    // 攻击方向优先使用 Y 轴（如果没有 Y 轴速度则用 X 轴）
    if (facing.y === 0 && facing.x !== 0) {
      facing.y = 0;
    } else if (facing.x === 0 && facing.y === 0) {
      facing.y = 1; // 默认向下
    }
    
    // 计算攻击位置（玩家前方 60 像素）
    const attackX = player.x + facing.x * 60;
    const attackY = player.y + facing.y * 60;
    
    // 显示攻击指示器
    this.showAttackIndicator(attackX, attackY, facing);
    
    // 查找攻击范围内的怪物
    let hitCount = 0;
    this.monsters.forEach(m => {
      if (!m.active) return;
      
      const dist = Phaser.Math.Distance.Between(attackX, attackY, m.x, m.y);
      if (dist < 50) { // 攻击范围 50 像素
        const damage = player.stats.atk;
        m.takeDamage(damage);
        this.createHitEffect(m.x, m.y);
        hitCount++;
      }
    });
    
    if (hitCount > 0) {
      console.log(`⚔️ 攻击命中 ${hitCount} 个怪物`);
    } else {
      console.log(`💨 攻击落空`);
    }
  }
  
  showAttackIndicator(x, y, facing) {
    // 创建攻击特效（扇形/圆形指示器）
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff, 0.8);
    
    // 攻击范围圆圈
    graphics.fillCircle(x, y, 50);
    
    // 攻击方向箭头
    graphics.lineStyle(3, 0xffff00, 1);
    const arrowLength = 40;
    const endX = x + (facing.x || 0) * arrowLength;
    const endY = y + (facing.y || 1) * arrowLength;
    graphics.moveTo(x, y);
    graphics.lineTo(endX, endY);
    
    // 0.3 秒后消失
    this.scene.time.delayedCall(300, () => {
      graphics.destroy();
    });
  }
  
  createHitEffect(x, y) {
    // 命中特效（红色闪光）
    const flash = this.scene.add.circle(x, y, 30, 0xff0000, 0.6);
    this.scene.tweens.add({
      targets: flash,
      scale: 1.5,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy()
    });
    
    // 伤害数字
    const dmgText = this.scene.add.text(x, y - 20, `-${this.scene.player.stats.atk}`, {
      fontSize: 20,
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: dmgText,
      y: dmgText.y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => dmgText.destroy()
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
