import Phaser from 'phaser';

class MainUI {
  constructor(scene) {
    this.scene = scene;
    this.hpText = null;
    this.mpText = null;
    this.hpBar = null;
    this.mpBar = null;
    this.skillTexts = {};
  }

  createUI() {
    // 左上角 - 角色信息
    this.createCharacterPanel();
    
    // 右下角 - 技能栏
    this.createSkillBar();
    
    // 右上角 - 等级和经验
    this.createExpPanel();
    
    console.log('✅ UI 创建完成');
  }
  
  createExpPanel() {
    // 背景
    const bg = this.scene.add.rectangle(1180, 40, 200, 60, 0x000000, 0.7);
    bg.setOrigin(1, 0);
    
    // 等级文字
    this.levelText = this.scene.add.text(1170, 20, 'Lv.1', {
      fontSize: 20,
      fill: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(1, 0);
    
    // 经验文字
    this.expText = this.scene.add.text(1170, 45, 'EXP: 0/100', {
      fontSize: 16,
      fill: '#00ff00'
    }).setOrigin(1, 0);
  }
  
  createCharacterPanel() {
    // 背景
    const bg = this.scene.add.rectangle(100, 40, 200, 80, 0x000000, 0.7);
    bg.setOrigin(0, 0);
    
    // HP 文字
    this.hpText = this.scene.add.text(20, 20, 'HP: 500/500', {
      fontSize: 18,
      fill: '#00ff00',
      fontStyle: 'bold'
    });
    
    // HP 条背景
    this.hpBarBg = this.scene.add.rectangle(20, 45, 160, 10, 0x333333);
    this.hpBarBg.setOrigin(0, 0);
    
    // HP 条
    this.hpBar = this.scene.add.rectangle(20, 45, 160, 10, 0x00ff00);
    this.hpBar.setOrigin(0, 0);
    
    // MP 文字
    this.mpText = this.scene.add.text(20, 60, 'MP: 200/200', {
      fontSize: 18,
      fill: '#0088ff',
      fontStyle: 'bold'
    });
    
    // MP 条背景
    this.mpBarBg = this.scene.add.rectangle(20, 85, 160, 10, 0x333333);
    this.mpBarBg.setOrigin(0, 0);
    
    // MP 条
    this.mpBar = this.scene.add.rectangle(20, 85, 160, 10, 0x0088ff);
    this.mpBar.setOrigin(0, 0);
  }
  
  createSkillBar() {
    const skills = ['Q', 'W', 'E', 'R', 'D'];
    const startX = 900;
    const startY = 620;
    const spacing = 70;
    
    skills.forEach((key, index) => {
      const x = startX + index * spacing;
      
      // 技能框背景
      const bg = this.scene.add.rectangle(x, startY, 60, 60, 0x333333, 0.9);
      bg.setStrokeStyle(2, 0x666666);
      
      // 技能键
      const text = this.scene.add.text(x, startY - 20, key, {
        fontSize: 24,
        fill: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      
      // 技能名称
      const name = this.scene.add.text(x, startY + 20, '-', {
        fontSize: 12,
        fill: '#888888'
      }).setOrigin(0.5);
      
      this.skillTexts[key.toLowerCase()] = name;
    });
    
    // 说明
    this.scene.add.text(900, 600, '技能栏', {
      fontSize: 16,
      fill: '#888888'
    });
  }

  update(player) {
    if (!player || !this.hpText) return;
    
    // 更新 HP
    const hpPercent = player.stats.hp / player.stats.maxHp;
    this.hpText.setText(`HP: ${Math.floor(player.stats.hp)}/${player.stats.maxHp}`);
    this.hpBar.setScale(hpPercent, 1);
    this.hpBar.setOrigin(0, 0);
    
    // HP 颜色根据血量变化
    if (hpPercent > 0.5) {
      this.hpBar.setFillStyle(0x00ff00);
    } else if (hpPercent > 0.25) {
      this.hpBar.setFillStyle(0xffff00);
    } else {
      this.hpBar.setFillStyle(0xff0000);
    }
    
    // 更新 MP
    const mpPercent = player.stats.mp / player.stats.maxMp;
    this.mpText.setText(`MP: ${Math.floor(player.stats.mp)}/${player.stats.maxMp}`);
    this.mpBar.setScale(mpPercent, 1);
    this.mpBar.setOrigin(0, 0);
    
    // 更新技能名称
    if (player.skills) {
      ['q', 'w', 'e', 'r', 'd'].forEach(key => {
        if (this.skillTexts[key] && player.skills[key]) {
          this.skillTexts[key].setText(player.skills[key].name);
          this.skillTexts[key].setColor('#ffffff');
        } else if (this.skillTexts[key]) {
          this.skillTexts[key].setText('-');
          this.skillTexts[key].setColor('#888888');
        }
      });
    }
    
    // 更新等级和经验
    if (this.levelText && this.expText) {
      const level = player.level || 1;
      const exp = player.exp || 0;
      const expToNext = player.expToNext || 100;
      
      this.levelText.setText(`Lv.${level}`);
      this.expText.setText(`EXP: ${exp}/${expToNext}`);
    }
  }
  
  cleanup() {
    // UI 清理
  }
}

export default MainUI;
