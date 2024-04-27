import Phaser from 'phaser';
import StartingScene from '../scenes/starting-scene.js';
import BulletsDemoScene from '../scenes/bullets-demo.js';
import MainMenuScene from '../scenes/mainMenu-scene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: false,
    zoom: 1.0,
    scene: [MainMenuScene, StartingScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0,
                debug: true // set to true to view zones
            }
        }
    },
};

const game = new Phaser.Game(config);
