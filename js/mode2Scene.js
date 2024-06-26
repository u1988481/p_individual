// mode2Scene.js
export class Mode2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Mode2Scene' });
    }

    init(data) {
        this.level = data.level || 1;
        this.points = data.points || 100;
        this.pairs = data.pairs || 2;
        this.difficulty = data.difficulty || 'normal'; // Add difficulty
        this.flipDelay = this.getFlipDelay(this.difficulty);
        this.penalty = this.getPenalty(this.difficulty);
        this.cardBack = 'back';
        this.cardFaces = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
        this.cards = [];
        this.flippedCards = [];
        this.pairsFound = data.pairsFound || 0;
        this.status = data.status || 'playing';
        this.cardStates = data.cardStates || [];
    }

    preload() {
        this.load.image('back', '../resources/back.png');
        this.cardFaces.forEach(face => {
            this.load.image(face, `../resources/${face}.png`);
        });
    }

    create() {
        this.add.text(400, 30, `Nivell: ${this.level}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.pointsText = this.add.text(400, 60, `Punts: ${this.points}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        let items = this.cardFaces.slice(0, this.pairs).concat(this.cardFaces.slice(0, this.pairs));
        Phaser.Utils.Array.Shuffle(items);

        let cardIndex = 0;
        let cardSize = 100;
        let spacing = 20;
        let cols = Math.ceil(Math.sqrt(this.pairs * 2));
        let rows = Math.ceil(this.pairs * 2 / cols);
        let xOffset = (800 - (cols * (cardSize + spacing) - spacing)) / 2;
        let yOffset = (600 - (rows * (cardSize + spacing) - spacing)) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (cardIndex >= items.length) break;

                let x = xOffset + col * (cardSize + spacing);
                let y = yOffset + row * (cardSize + spacing);
                let card = this.add.image(x, y, items[cardIndex]).setInteractive();
                card.setDisplaySize(cardSize, cardSize);
                card.frontFace = items[cardIndex];
                card.cardIndex = cardIndex;
                card.flipped = true; // All cards are initially face-up
                card.on('pointerdown', () => this.flipCard(card));
                this.cards.push(card);

                cardIndex++;
            }
        }

        if (this.cardStates.length > 0) {
            // Restore the saved state of the cards
            this.cards.forEach((card, index) => {
                let savedCard = this.cardStates[index];
                if (savedCard) {
                    card.x = savedCard.x;
                    card.y = savedCard.y;
                    card.frontFace = savedCard.frontFace;
                    card.flipped = savedCard.flipped;
                    if (card.flipped) {
                        card.setTexture(card.frontFace);
                    } else {
                        card.setTexture(this.cardBack);
                    }
                }
            });
        } else {
            // Set a delay based on the difficulty level to flip the cards face-down
            this.time.delayedCall(this.flipDelay, () => {
                this.cards.forEach(card => this.setCardFaceDown(card));
            }, [], this);
        }

        // Add Save Button
        this.saveButton = this.add.text(700, 20, 'Guardar', { fontSize: '24px', fill: '#fff', backgroundColor: '#4CAF50', padding: { left: 10, right: 10, top: 5, bottom: 5 }, borderColor: '#0f0', borderWidth: 2 }).setOrigin(0.5).setInteractive();
        this.saveButton.setInteractive(false);
        this.time.delayedCall(2000, () => {
            this.saveButton.setInteractive(true);
        });

        this.saveButton.on('pointerover', () => {
            this.saveButton.setStyle({ fill: '#ff0' });
        });
        this.saveButton.on('pointerout', () => {
            this.saveButton.setStyle({ fill: '#fff' });
        });
        this.saveButton.on('pointerdown', () => {
            if (this.status === 'playing') {
                this.saveGame();
            }
        });

        // Add Back to Menu Button
        let backButton = this.add.text(100, 20, 'Tornar al menú', { fontSize: '24px', fill: '#fff', backgroundColor: '#4CAF50', padding: { left: 10, right: 10, top: 5, bottom: 5 }, borderColor: '#0f0', borderWidth: 2 }).setOrigin(0.5).setInteractive();
        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#ff0' });
        });
        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#fff' });
        });
        backButton.on('pointerdown', () => {
            this.scene.stop('Mode2Scene');
            location.reload();
        });
    }

    flipCard(card) {
        if (this.status !== 'playing') return; // Prevent interaction if game is over
        if (this.flippedCards.length < 2 && !card.flipped) {
            card.setTexture(card.frontFace);
            card.flipped = true;
            this.flippedCards.push(card);

            if (this.flippedCards.length === 2) {
                this.checkForMatch();
            }
        }
    }

    setCardFaceDown(card) {
        card.setTexture(this.cardBack);
        card.flipped = false;
    }

    checkForMatch() {
        let [first, second] = this.flippedCards;

        if (first.frontFace === second.frontFace) {
            this.pairsFound++;
            this.flippedCards = [];

            if (this.pairsFound === this.pairs) {
                this.levelUp();
            }
        } else {
            this.time.delayedCall(1000, () => {
                this.flippedCards.forEach(card => this.setCardFaceDown(card));
                this.flippedCards = [];
            });

            this.updatePoints();
        }
    }

    endGame() {
        this.status = 'lost';
        this.showEndMessage('Has perdut!', '#f00');
    }

    saveGame() {
        const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
        const gameState = {
            mode: 'Mode2Scene',
            data: {
                level: this.level,
                points: this.points,
                pairs: this.pairs,
                pairsFound: this.pairsFound,
                flipDelay: this.flipDelay,
                penalty: this.penalty,
                cardStates: this.cards.map(card => ({
                    x: card.x,
                    y: card.y,
                    frontFace: card.frontFace,
                    flipped: card.flipped
                })),
                status: this.status // Add game status to save
            }
        };
        savedGames.push(gameState);
        if (savedGames.length > 3) savedGames.shift(); // Keep only the last 3 saved games
        localStorage.setItem('savedGames', JSON.stringify(savedGames));
        alert("Partida guardada!");
    }

    levelUp() {
        this.level++;
        if (this.pairs < 6) {
            this.pairs++; // Increase pairs up to a maximum of 6
        } else if (this.flipDelay > 100) {
            this.flipDelay -= 100; // Decrease delay with a minimum of 100ms
        } else {
            this.penalty += 15; // Increase penalty
        }

        this.scene.restart({ level: this.level, points: this.points, pairs: this.pairs, pairsFound: 0, flipDelay: this.flipDelay, penalty: this.penalty, difficulty: this.difficulty });
    }

    getFlipDelay(difficulty) {
        switch (difficulty) {
            case 'easy':
                return 2000;
            case 'normal':
                return 1000;
            case 'hard':
                return 100;
            default:
                return 1000;
        }
    }

    getPenalty(difficulty) {
        switch (difficulty) {
            case 'easy':
                return 15;
            case 'normal':
                return 25;
            case 'hard':
                return 50;
            default:
                return 25;
        }
    }

    updatePoints() {
        if (this.flippedCards.length === 2 && this.flippedCards[0].frontFace !== this.flippedCards[1].frontFace) {
            this.points -= this.penalty;
            if (this.points < 0) this.points = 0; // Ensure points don't go negative
            this.pointsText.setText(`Punts: ${this.points}`); // Update the points text

            if (this.points === 0) {
                this.status = 'lost';
                this.showEndMessage('Has perdut!', '#f00');
            }
        }
    }

    showEndMessage(message, color) {
        this.add.text(400, 300, message, { fontSize: '64px', fill: color }).setOrigin(0.5);
        this.saveButton.disableInteractive(); // Disable save button
        this.cards.forEach(card => card.removeInteractive()); // Disable interaction with all cards
    }
}
