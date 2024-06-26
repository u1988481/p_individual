// menu.js
import { OptionsScene } from './optionsScene.js';
import { GameScene } from './gameScene.js';
import { Mode2OptionsScene } from './mode2OptionsScene.js';
import { Mode2Scene } from './mode2Scene.js';
import { LoadGameScene } from './loadGameScene.js';
import { RankingsScene } from './rankingsScene.js'; // Import RankingsScene

document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('play');
    const rankingsButton = document.getElementById('rankings');
    const loadButton = document.getElementById('load');
    const container = document.getElementById('container');
    const gameContainer = document.getElementById('game-container');
    let game;

    if (playButton) {
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
                startGame('OptionsScene'); // Start the regular game
            });

            // Add event listener to Mode 2 button
            mode2Button.addEventListener('click', function() {
                container.style.display = 'none';
                gameContainer.style.display = 'block';
                startGame('Mode2OptionsScene'); // Start the Mode 2 options scene
            });
        });
    }

    if (rankingsButton) {
        rankingsButton.addEventListener('click', function() {
            container.style.display = 'none';
            gameContainer.style.display = 'block';
            startGame('RankingsScene'); // Start the RankingsScene
        });
    }

    if (loadButton) {
        loadButton.addEventListener('click', function() {
            container.style.display = 'none';
            gameContainer.style.display = 'block';
            startGame('LoadGameScene');
        });
    }

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

    function startGame(scene) {
        if (game) {
            game.destroy(true);
        }

        var config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            scene: [] // No initial scene
        };

        game = new Phaser.Game(config);

        // Add all scenes manually
        game.scene.add('OptionsScene', OptionsScene);
        game.scene.add('GameScene', GameScene);
        game.scene.add('Mode2OptionsScene', Mode2OptionsScene);
        game.scene.add('Mode2Scene', Mode2Scene);
        game.scene.add('LoadGameScene', LoadGameScene);
        game.scene.add('RankingsScene', RankingsScene); // Add RankingsScene

        // Start the desired scene
        game.scene.start(scene);
    }
});
