import Phaser from 'phaser';
import { MapGenManager3 } from '../src/systems/MapGenManager3.js';

const width = 28;
const height = 35;

export default class MapGen3DemoScene extends Phaser.Scene {
    /** @type {MapGenManager3 | null} */ genMap;
    /** @type {Phaser.GameObjects.Sprite[]} */ gameObjects;

    constructor() {
        super({ key: 'MapGen3DemoScene' });
        this.genMap = null;
    }

    preload() {
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png');

        this.genMap = new MapGenManager3(width, height);
    }

    create() {
        const map = this.make.tilemap({ width: width, height: height });

        const tileset = map.addTilesetImage('Dungeon_Tileset', 'tiles');

        const ground = map.createBlankLayer('Ground', tileset);
        const floor = map.createBlankLayer('Floor', tileset);
        const walls = map.createBlankLayer('Walls', tileset);
        const decals = map.createBlankLayer('Decals', tileset);
        const upper = map.createBlankLayer('Upper', tileset);
        const leaves = map.createBlankLayer('Leaves', tileset);

        ground.putTilesAt(this.genMap.ground, 0, 0);
        floor.putTilesAt(this.genMap.floor, 0, 0);
        walls.putTilesAt(this.genMap.walls, 0, 0);
        decals.putTilesAt(this.genMap.decals, 0, 0);
        upper.putTilesAt(this.genMap.upper, 0, 0);
        leaves.putTilesAt(this.genMap.leaves, 0, 0);

        this.tileSize = 32;

        // worldLayer.setCollisionBetween(1, 500);
        // aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        this.setupCamera();
    }

    setupCamera() {
        this.cameras.main.setBounds(0, 0, 1600, 1200);
        this.cursors = this.input.keyboard.createCursorKeys();
        let wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: this.cameras.main,
            left: wasd.left,
            right: wasd.right,
            up: wasd.up,
            down: wasd.down,
            speed: 0.5
        });
    }

    update(time, delta) {
        this.controls.update(delta);
    }
}
