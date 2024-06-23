export class Mode2OptionsScene extends Phaser.Scene {
    constructor() {
      super({ key: 'Mode2OptionsScene' })
    }
  
    create() {
      this.add.text(400, 150, 'Mode 2', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5)
  
      let startButton = this.add.text(400, 300, 'Començar', { fontSize: '32px', fill: '#fff', backgroundColor: '#4CAF50', padding: { left: 20, right: 20, top: 10, bottom: 10 }, borderColor: '#0f0', borderWidth: 2 }).setOrigin(0.5).setInteractive()
      startButton.on('pointerover', () => {
        startButton.setStyle({ fill: '#ff0' })
      })
      startButton.on('pointerout', () => {
        startButton.setStyle({ fill: '#fff' })
      })
      startButton.on('pointerdown', () => {
        this.scene.stop('Mode2OptionsScene')
        this.scene.start('Mode2Scene', { level: 1, points: 0, pairs: 2, flipDelay: 2000, penalty: 15 })
      })
    }
  }
  