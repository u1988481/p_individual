export class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
    }

    create() {
        this.add.text(400, 50, 'Opcions', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        // Number of Pairs
        this.add.text(200, 150, 'Parelles de cartes:', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        this.pairsText = this.add.text(600, 150, '2', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.pairs = 2;

        let upArrowPairs = this.add.text(650, 150, '⬆️', { fontSize: '24px', fill: '#0f0' }).setOrigin(0.5).setInteractive();
        upArrowPairs.on('pointerdown', () => {
            if (this.pairs < 6) {
                this.pairs++;
                this.pairsText.setText(this.pairs);
            }
        });

        let downArrowPairs = this.add.text(650, 180, '⬇️', { fontSize: '24px', fill: '#f00' }).setOrigin(0.5).setInteractive();
        downArrowPairs.on('pointerdown', () => {
            if (this.pairs > 2) {
                this.pairs--;
                this.pairsText.setText(this.pairs);
            }
        });

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
            this.scene.start('GameScene', { pairs: this.pairs, difficulty: difficulty });
        });
    }
}
