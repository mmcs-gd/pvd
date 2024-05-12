import Phaser from 'phaser';
import { MapGenManager2 } from '../src/systems/MapGenManager2.js';

// debug bullets params
const width = 70;
const height = 35;

export default class MapGen2DemoScene extends Phaser.Scene {
    /** @type {Phaser.GameObjects.Sprite[]} */ gameObjects;

    constructor() {
        super({ key: 'MapGen2DemoScene' });
    }

    genmap = null

    preload() {
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png');
        
        this.genmap = new MapGenManager2(width, height)
    }

    create() {
        const map = this.make.tilemap({width: width, height: height});

        const tileset = map.addTilesetImage('Dungeon_Tileset', 'tiles');

        const belowFloor = map.createBlankLayer('Ground', tileset);
        const belowLayer = map.createBlankLayer('Floor', tileset);
        const worldLayer = map.createBlankLayer('Walls', tileset);

        belowFloor.putTilesAt(this.genmap.ground, 0, 0)
        belowLayer.putTilesAt(this.genmap.floor, 0, 0)
        worldLayer.putTilesAt(this.genmap.walls, 0, 0)

        // const decals = map.createLayer('Decals', tileset, 0, 0);
        // const aboveLayer = map.createLayer('Upper', tileset, 0, 0);
        // const aboveUpper = map.createLayer('Leaves', tileset, 0, 0);
        this.tileSize = 32;

        // worldLayer.setCollisionBetween(1, 500);
        // aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
    }

    update() {
    }
}