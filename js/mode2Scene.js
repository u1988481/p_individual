export class Mode2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Mode2Scene' });
    }

    init(data) {
        this.level = data.level || 1;
        this.points = data.points || 0;
        this.pairs = data.pairs || 2;
        this.flipDelay = data.flipDelay || 2000;
        this.penalty = data.penalty || 15;
        this.cardBack = 'back';
        this.cardFaces = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
        this.cards = [];
        this.flippedCards = [];
        this.pairsFound = 0;
    }

    preload() {
        this.load.image('back', '../resources/back.png');
        this.cardFaces.forEach(face => {
            this.load.image(face, `../resources/${face}.png`);
        });
    }

    create() {
        this.add.text(400, 30, `Nivell: ${this.level}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 60, `Punts: ${this.points}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

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
        this.time.delayedCall(this.flipDelay, () => {
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
            this.points += 10; // Add points for a correct match
            this.flippedCards = [];

            if (this.pairsFound === this.pairs) {
                this.levelUp();
            }
        } else {
            this.time.delayedCall(1000, () => {
                this.flippedCards.forEach(card => this.setCardFaceDown(card));
                this.flippedCards = [];
            });

            this.points -= this.penalty; // Subtract points for an incorrect match
            if (this.points < 0) this.points = 0; // Ensure points don't go negative
        }
    }

    levelUp() {
        this.level++;
        if (this.pairs < 6) {
            this.pairs++; // Increase pairs up to a maximum of 6
        } else if (this.flipDelay > 100) {
            this.flipDelay -= 100; // Decrease delay with a minimum of 100ms
        } else {
            this.penalty += 5; // Increase penalty
        }

        this.scene.restart({ level: this.level, points: this.points, pairs: this.pairs, flipDelay: this.flipDelay, penalty: this.penalty });
    }
}
