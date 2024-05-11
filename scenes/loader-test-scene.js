import Phaser from 'phaser';
import { DogAnimationLoader } from 'src/utils/resource-loaders/DogAnimationLoader.js';
import { Penguin } from 'src/modules/Penguin/Penguin.js';
import { GAME_CONFIG } from 'src/resources/game-config.js';
import { loadPenguinsNGunsAssets } from 'src/utils/resource-loaders/load-penguins-n-guns-assets.js';
import { Gun } from 'src/modules/Gun/Gun.js';
import { loadPenguinsNGunsFromDB } from 'src/utils/resource-loaders/load-penguins-n-guns-db.js';

class LoaderTestScene extends Phaser.Scene {

    constructor() {
        super('LoaderTestScene');
    }

    preload () {
        loadPenguinsNGunsAssets(this);
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

        const sceneCenter = {
            x: GAME_CONFIG.width / 2, y: GAME_CONFIG.height / 2
        };
        this.target = this.add.circle(sceneCenter.x, sceneCenter.y, 5, 0xff0000);
        /*        const gunConfig1 = new Gun({
            id: '9c3f7a68-9da2-4599-b0ae-f0bbd7e709f5',
            name: 'BOOM-BOOM',
            assetKey: '7g',
            weaponType: 'Bomb',
            damage: 500,
            cost: 5000,
            range: 1
        });
        const penpen1 = new Penguin(this, sceneCenter.x, 0.5 * sceneCenter.y, {
            bodyKey: '2c',
            gunConfig: gunConfig1,
            target: this.target,
            faceToTarget: true,
        });

        const penpen2 = new Penguin(this, 1.25 * sceneCenter.x, 0.75 * sceneCenter.y, {
            bodyKey: '3c',
            gunConfig: gunConfig1,
            target: this.target,
            faceToTarget: true,
        });*/
        const config = [{
            penguinId: '28c10fd3-dfe5-4f4b-83dc-59bf7884a07b',
            gunId: '8d17522e-2ab8-41d4-b953-931af837a86e'
        }];
        const penguins = loadPenguinsNGunsFromDB(config, {
            scene: this,
            target: this.target,
            sceneCenter
        });
        this.gameObjects.push(...penguins);

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