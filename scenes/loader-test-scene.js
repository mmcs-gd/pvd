import Phaser from 'phaser';
import { GAME_CONFIG } from 'src/resources/game-config.js';
import { loadPenguinsNGunsAssets } from 'src/utils/resource-loaders/load-penguins-n-guns-assets.js';
import { loadPenguinsNGunsFromDB } from 'src/utils/resource-loaders/load-penguins-n-guns-db.js';

class LoaderTestScene extends Phaser.Scene {

    constructor() {
        super('LoaderTestScene');
    }

    preload () {
        loadPenguinsNGunsAssets(this);
        //loading map tiles and json with positions
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png?url');
        this.load.tilemapTiledJSON('map', 'dungeon_room.json?url');
    }

    create() {
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
        this.target = this.add.circle(sceneCenter.x, sceneCenter.y, 5, 0x00ffff);

        const config = [
            {
                penguinId: '28c10fd3-dfe5-4f4b-83dc-59bf7884a07b',
                gunId: 'a96c89bb-7a5b-46d4-9a13-5d229c75dc8d',
            },{
                penguinId: '6f41ff53-9294-4d23-b250-35e21d5e08d7',
                gunId: '81d8a7f8-d81f-4e2d-8d24-7b6579254f6a',
            },{
                penguinId: '17b0b9e4-cb29-4c24-a0b1-99e6d75d499d',
                gunId: '625ca7b1-3e8f-4c76-83b1-1072f18b0447',
            },{
                penguinId: '11a02a65-6af1-4a76-9e62-0be50a5bc349',
                gunId: '8d17522e-2ab8-41d4-b953-931af837a86e',
            },{
                penguinId:'f5a1c07e-4fe7-4994-b70e-24014ab5d3a7',
                gunId: '15bebb4b-8493-4998-98d0-13f8d3848e6b',
            },{
                penguinId: '97e72e33-217e-4a0b-a7b1-602a1c947369',
                gunId: '2b77b246-c15d-47c7-aabb-6354c43a2182',
            },{
                penguinId: 'bd48a445-682b-44de-94aa-769382c65f56',
                gunId: '9c3f7a68-9da2-4599-b0ae-f0bbd7e709f5',
            },{
                penguinId: 'f20a242a-ba80-4e3f-97d6-d3dabf2df7f4',
                gunId: 'ce4ab059-0477-4bc3-ae6c-fd3f4de4a126',
            },{
                penguinId: 'c280abf6-d8c1-4e8d-ace6-729fd21c6c11',
                gunId: '7b90d51a-13e6-4d5b-b1e6-af19a6c2e8d1',
            },{
                penguinId: '5b4b826e-1564-434f-8168-53f9fbf71d35',
                gunId: '4d5a224d-1f71-41f8-af5c-7d335ab60eb4',
            }
        ];

        const penguins = loadPenguinsNGunsFromDB(config, {
            scene: this,
            target: this.target,
            sceneCenter
        });

        const ANGLE_STEP = 2 * Math.PI / 10;
        let angle = 0;
        penguins.forEach((pen, idx) => {
            pen.x = sceneCenter.x + Math.cos(angle) * sceneCenter.x * 0.5;
            pen.y = sceneCenter.y + Math.sin(angle) * sceneCenter.y * 0.5;
            angle += ANGLE_STEP;
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

        this.input.keyboard.on('keydown-SPACE', event => {
            this.scene.start('PenguinSampleScene');
        });
    }
}

export {
    LoaderTestScene
};