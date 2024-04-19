import './style.css'

import Phaser from 'phaser'
// import StartingScene from './scenes/starting-scene.js';
import {PreloaderScene} from "./scenes/loading-scene.ts";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: false,
    zoom: 1.0,
    // scene: StartingScene,
    scene: PreloaderScene,
    // backgroundColor: '#2e2a47', // Set to any hex color you like, e.g., black
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0,
                debug: true // set to true to view zones
            }
        }
    },
};

const game = new Phaser.Game(config);
