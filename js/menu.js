import { OptionsScene } from './optionsScene.js';
import { GameScene } from './gameScene.js';

document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('play');
    const container = document.getElementById('container');
    const gameContainer = document.getElementById('game-container');

    playButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the event from bubbling up to the document
        
        // Remove existing mode buttons if any
        removeModeButtons();

        // Create a button group div
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        playButton.after(buttonGroup); // Insert the button group after the play button

        // Create Mode 1 button
        const mode1Button = document.createElement('button');
        mode1Button.id = 'mode1';
        mode1Button.innerText = 'Mode 1';
        mode1Button.className = 'center';
        buttonGroup.appendChild(mode1Button);

        // Create Mode 2 button
        const mode2Button = document.createElement('button');
        mode2Button.id = 'mode2';
        mode2Button.innerText = 'Mode 2';
        mode2Button.className = 'center';
        buttonGroup.appendChild(mode2Button);

        // Add event listener to Mode 1 button
        mode1Button.addEventListener('click', function() {
            container.style.display = 'none';
            gameContainer.style.display = 'block';
            startGame();
        });

        // Add event listener to Mode 2 button
        mode2Button.addEventListener('click', function() {
            console.log('Mode 2 clicked');
        });
    });

    // Function to remove mode buttons
    function removeModeButtons() {
        const buttonGroup = document.querySelector('.button-group');
        if (buttonGroup) {
            buttonGroup.remove();
        }
    }

    // Add event listener to document to hide mode buttons when clicking outside
    document.addEventListener('click', function(event) {
        const buttonGroup = document.querySelector('.button-group');
        const playButton = document.getElementById('play');
        if (buttonGroup && !buttonGroup.contains(event.target) && !playButton.contains(event.target)) {
            removeModeButtons();
        }
    });

    function startGame() {
        var config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            scene: [OptionsScene, GameScene]
        };

        var game = new Phaser.Game(config);
    }
});
