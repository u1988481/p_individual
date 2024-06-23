export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.pairs = data.pairs;
        this.difficulty = data.difficulty;
        this.cardBack = 'back';
        this.cardFaces = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
        this.cards = [];
        this.flippedCards = [];
        this.pairsFound = 0;
        this.points = 100;
    }

    preload() {
        this.load.image('back', '../resources/back.png');
        this.cardFaces.forEach(face => {
            this.load.image(face, `../resources/${face}.png`);
        });
    }

    create() {
        this.add.text(400, 50, `Game Start: ${this.pairs} pairs, ${this.difficulty} difficulty`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

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

        // Set a delay based on the difficulty level to flip the cards face-down
        this.time.delayedCall(this.getFlipDelay(), () => {
            this.cards.forEach(card => this.setCardFaceDown(card));
        }, [], this);
    }

    flipCard(card) {
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
                this.add.text(400, 300, 'Has guanyat!', { fontSize: '64px', fill: '#0f0' }).setOrigin(0.5);
                let backButton = this.add.text(400, 400, 'Tornar al menú', { fontSize: '32px', fill: '#0f0', backgroundColor: '#4CAF50', padding: { left: 20, right: 20, top: 10, bottom: 10 }, borderColor: '#0f0', borderWidth: 2 }).setOrigin(0.5).setInteractive();
                backButton.on('pointerover', () => {
                    backButton.setStyle({ fill: '#ff0' });
                });
                backButton.on('pointerout', () => {
                    backButton.setStyle({ fill: '#0f0' });
                });
                backButton.on('pointerdown', () => {
                    location.reload();
                });
            }
        } else {
            this.time.delayedCall(1000, () => {
                this.flippedCards.forEach(card => this.setCardFaceDown(card));
                this.flippedCards = [];
            });

            this.updatePoints();
        }
    }

    getFlipDelay() {
        switch (this.difficulty) {
            case 'easy':
                return 2000;
            case 'normal':
                return 1000;
            case 'hard':
                return 300;
            default:
                return 1000;
        }
    }

    updatePoints() {
        switch (this.difficulty) {
            case 'easy':
                this.points -= 15;
                break;
            case 'normal':
                this.points -= 25;
                break;
            case 'hard':
                this.points -= 50;
                break;
        }

        if (this.points <= 0) {
            this.add.text(400, 300, 'Has perdut!', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5);
            let backButton = this.add.text(400, 400, 'Tornar al menú', { fontSize: '32px', fill: '#f00', backgroundColor: '#4CAF50', padding: { left: 20, right: 20, top: 10, bottom: 10 }, borderColor: '#f00', borderWidth: 2 }).setOrigin(0.5).setInteractive();
            backButton.on('pointerover', () => {
                backButton.setStyle({ fill: '#ff0' });
            });
            backButton.on('pointerout', () => {
                backButton.setStyle({ fill: '#f00' });
            });
            backButton.on('pointerdown', () => {
                location.reload();
            });
        }
    }
}
