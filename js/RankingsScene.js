// rankingsScene.js
export class RankingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RankingsScene' });
    }

    create() {
        this.add.text(400, 50, 'Ranking\n(millors partides mode 2)', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const savedGames = this.loadSavedGames();
        const mode2Games = savedGames.filter(game => game.mode === 'Mode2Scene');

        // Sort games by highest level reached
        mode2Games.sort((a, b) => b.data.level - a.data.level);

        const topGames = mode2Games.slice(0, 3);

        topGames.forEach((game, index) => {
            this.add.text(400, 150 + index * 50, `Partida ${index + 1}: Nivell ${game.data.level}, Dificultat ${game.data.difficulty}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        });

        let backButton = this.add.text(400, 500, 'Tornar al menú', { fontSize: '32px', fill: '#fff', backgroundColor: '#4CAF50', padding: { left: 20, right: 20, top: 10, bottom: 10 }, borderColor: '#0f0', borderWidth: 2 }).setOrigin(0.5).setInteractive();
        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#ff0' });
        });
        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#fff' });
        });
        backButton.on('pointerdown', () => {
            this.scene.stop('RankingsScene');
            location.reload();
        });
    }

    loadSavedGames() {
        return JSON.parse(localStorage.getItem('savedGames')) || [];
    }
}
