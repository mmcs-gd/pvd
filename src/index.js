import Phaser from 'phaser';
import BulletsDemoScene from '../scenes/bullets-demo.js';
import MainMenuScene from '../scenes/mainMenu-scene.js';
import { PreloaderScene } from '../scenes/loading-scene.js';
import { LoaderTestScene } from '../scenes/loader-test-scene.js';
import StartingScene from '../scenes/starting-scene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: false,
    zoom: 1.0,
    scene: [StartingScene, LoaderTestScene, PreloaderScene, MainMenuScene, BulletsDemoScene],
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
