import Phaser from 'phaser';
import BulletsDemoScene from '../scenes/bullets-demo.js';
import MainMenuScene from '../scenes/mainMenu-scene.js';
import { PreloaderScene } from '../scenes/loading-scene.js';
import { LoaderTestScene } from '../scenes/loader-test-scene.js';
import MapGen2DemoScene from '../scenes/map-gen2-demo.js';
import MapGen3DemoScene from 'scenes/map-gen3-demo.js';
import StartingScene from '../scenes/starting-scene.js';
import { GAME_CONFIG } from 'src/resources/game-config.js';
import { SampleScene } from 'src/modules/Penguin/SampleScene.js';
import VfxDemoScene from 'scenes/vfx-demo.js';
import { SteeringScene } from 'scenes/steering-scene.js';
import { DebugWindow } from './UI/debug-window.js';
import LoseWindowScene from 'scenes/lose-window-scene.js';
import AIDemoScene from 'scenes/ai-demo.js';
import { applyDebugMiddleware } from './utils/DebugUtils.js';

const config = {
    type: Phaser.AUTO,
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    pixelArt: false,
    zoom: 1.0,
    scene: [PreloaderScene, AIDemoScene, LoseWindowScene, SteeringScene, MapGen2DemoScene, MapGen3DemoScene, StartingScene, LoaderTestScene, SampleScene, MainMenuScene, BulletsDemoScene, VfxDemoScene],
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
applyDebugMiddleware(config);
const game = new Phaser.Game(config);
