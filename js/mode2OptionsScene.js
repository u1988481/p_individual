// mode2OptionsScene.js
export class Mode2OptionsScene extends Phaser.Scene {
  constructor() {
      super({ key: 'Mode2OptionsScene' });
  }

  create() {
      this.add.text(400, 50, 'Opcions Mode 2', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

      // Difficulty Level
      this.add.text(200, 250, 'Dificultat:', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

      this.difficulties = ['Baixa', 'Normal', 'Alta'];
      this.difficultyIndex = 1;
      this.difficultyText = this.add.text(600, 250, this.difficulties[this.difficultyIndex], { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

      let upArrowDifficulty = this.add.text(650, 250, '⬆️', { fontSize: '24px', fill: '#0f0' }).setOrigin(0.5).setInteractive();
      upArrowDifficulty.on('pointerdown', () => {
          if (this.difficultyIndex < this.difficulties.length - 1) {
              this.difficultyIndex++;
              this.difficultyText.setText(this.difficulties[this.difficultyIndex]);
          }
      });

      let downArrowDifficulty = this.add.text(650, 280, '⬇️', { fontSize: '24px', fill: '#f00' }).setOrigin(0.5).setInteractive();
      downArrowDifficulty.on('pointerdown', () => {
          if (this.difficultyIndex > 0) {
              this.difficultyIndex--;
              this.difficultyText.setText(this.difficulties[this.difficultyIndex]);
          }
      });

      let startButton = this.add.text(400, 400, 'Començar', { fontSize: '32px', fill: '#fff', backgroundColor: '#4CAF50', padding: { left: 20, right: 20, top: 10, bottom: 10 }, borderColor: '#0f0', borderWidth: 2 }).setOrigin(0.5).setInteractive();
      startButton.on('pointerover', () => {
          startButton.setStyle({ fill: '#ff0' });
      });
      startButton.on('pointerout', () => {
          startButton.setStyle({ fill: '#fff' });
      });
      startButton.on('pointerdown', () => {
          let difficulty = ['easy', 'normal', 'hard'][this.difficultyIndex];
          this.scene.start('Mode2Scene', { pairs: this.pairs, difficulty: difficulty });
      });
  }
}
