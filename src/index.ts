import Phaser from 'phaser';
import {PreloaderScene} from 'src/scenes/loading-scene.ts';
import { MainMenuScene } from 'src/scenes/main-menu-scene';
import BulletsDemoScene from 'src/scenes/bullets-demo';


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: false,
    zoom: 1.0,
    scene: [PreloaderScene, MainMenuScene, BulletsDemoScene],
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
