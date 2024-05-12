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

        const ground = map.createBlankLayer('Ground', tileset);
        const floor = map.createBlankLayer('Floor', tileset);
        const walls = map.createBlankLayer('Walls', tileset);
        const decals = map.createBlankLayer('Decals', tileset);
        const upper = map.createBlankLayer('Upper', tileset);
        const leaves = map.createBlankLayer('Leaves', tileset);

        ground.putTilesAt(this.genmap.ground, 0, 0)
        floor.putTilesAt(this.genmap.floor, 0, 0)
        walls.putTilesAt(this.genmap.walls, 0, 0)
        decals.putTilesAt(this.genmap.decals, 0, 0)
        upper.putTilesAt(this.genmap.upper, 0, 0)
        leaves.putTilesAt(this.genmap.leaves, 0, 0)
        
        this.tileSize = 32;

        // worldLayer.setCollisionBetween(1, 500);
        // aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
    }

    update() {
    }
}