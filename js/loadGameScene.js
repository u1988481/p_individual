// loadGameScene.js
export class LoadGameScene extends Phaser.Scene {
  constructor() {
      super({ key: 'LoadGameScene' });
  }

  create() {
      this.add.text(400, 50, 'Carregar Partida', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

      const savedGames = this.loadSavedGames();
      // Only show the last 3 saved games
      const gamesToShow = savedGames.slice(-3).reverse();

      gamesToShow.forEach((game, index) => {
          let loadButton = this.add.text(400, 100 + index * 30, `Partida ${index + 1}`, { fontSize: '24px', fill: '#fff', backgroundColor: '#4CAF50', padding: { left: 20, right: 20, top: 10, bottom: 10 }, borderColor: '#0f0', borderWidth: 2 }).setOrigin(0.5).setInteractive();
          loadButton.on('pointerover', () => {
              loadButton.setStyle({ fill: '#ff0' });
          });
          loadButton.on('pointerout', () => {
              loadButton.setStyle({ fill: '#fff' });
          });
          loadButton.on('pointerdown', () => {
              this.loadGame(game);
          });
      });

      let backButton = this.add.text(400, 500, 'Tornar al menú', { fontSize: '32px', fill: '#fff', backgroundColor: '#4CAF50', padding: { left: 20, right: 20, top: 10, bottom: 10 }, borderColor: '#0f0', borderWidth: 2 }).setOrigin(0.5).setInteractive();
      backButton.on('pointerover', () => {
          backButton.setStyle({ fill: '#ff0' });
      });
      backButton.on('pointerout', () => {
          backButton.setStyle({ fill: '#fff' });
      });
      backButton.on('pointerdown', () => {
          this.scene.stop('LoadGameScene');
          location.reload();
      });
  }

  loadSavedGames() {
      return JSON.parse(localStorage.getItem('savedGames')) || [];
  }

  loadGame(game) {
      this.scene.stop('LoadGameScene');
      this.scene.start(game.mode, game.data);
  }
}
