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


config.scene.forEach((scene) => {
    const create = scene.prototype.create;
    /** @type {DebugWindow} */ let debugWindow;
    scene.prototype.create = function() {
        debugWindow = new DebugWindow(this);
        this.input.keyboard.on("keydown-BACKTICK", () => {
            debugWindow.toggle();
        });
        this.input.keyboard.on("keydown-THREE", () => {
            const activeScenes = this.scene.manager.getScenes();
            activeScenes.forEach((scene) => this.scene.stop(scene));
            const lastActiveSceneIndex = this.scene.manager.getIndex(activeScenes[activeScenes.length - 1]);
            const allScenes = this.scene.manager.scenes;
            this.scene.start(allScenes[(lastActiveSceneIndex + 1) % allScenes.length]);
        });
        create.call(this);
    }
    const update = scene.prototype.update;
    scene.prototype.update = function(time, delta) {
        update.call(this, time, delta);
        if (debugWindow.container !== null) debugWindow.container.update();
    }
});

const game = new Phaser.Game(config);
