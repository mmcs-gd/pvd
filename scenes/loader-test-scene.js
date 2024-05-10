import Phaser from 'phaser';
import { DogAnimationLoader } from 'src/utils/resource-loaders/DogAnimationLoader.js';
import { Penguin } from 'src/modules/Penguin/Penguin.js';
import { GAME_CONFIG } from 'src/resources/game-config.js';
import { loadPenguinsNGuns } from 'src/utils/resource-loaders/load-penguins-n-guns.js';

class LoaderTestScene extends Phaser.Scene {

    constructor() {
        super('LoaderTestScene');
    }

    preload () {
        loadPenguinsNGuns(this);
        //loading map tiles and json with positions
        this.load.image('tiles', '/tileset/Dungeon_Tileset.png?url');
        this.load.tilemapTiledJSON('map', '/dungeon_room.json?url');

        //loading sprite-sheets
        // Load dog animations
        DogAnimationLoader.preload('/sprites/pack/Characters/Dogs', this);

    }

    create() {
        DogAnimationLoader.create(this);
        this.gameObjects = [];
        const map = this.make.tilemap({key: 'map'});

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage('Dungeon_Tileset', 'tiles');


        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createLayer('Floor', tileset, 0, 0);
        const worldLayer = map.createLayer('Walls', tileset, 0, 0);
        const aboveLayer = map.createLayer('Upper', tileset, 0, 0);
        this.tileSize = 32;


        worldLayer.setCollisionBetween(1, 500);
        aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        const sceneCenter = [GAME_CONFIG.width / 2, GAME_CONFIG.height / 2];
        this.target = this.add.circle(...sceneCenter, 5, 0xff0000);

        // @ts-ignore
        this.gameObjects.push(new Penguin(this, ...sceneCenter, {
            bodyKey: '2c',
            gunKey: '2g',
            target: this.target,
            faceToTarget: true,
        }));

        // Setup debug boundaries
        this.input.keyboard.on('keydown-D', event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
        });
    }

    update() {
        if (this.gameObjects) {
            this.gameObjects.forEach(function (element) {
                element.update();
            });
        }

    }

    tilesToPixels(tileX, tileY) {
        return [tileX * this.tileSize, tileY * this.tileSize];
    }
}

export {
    LoaderTestScene
};