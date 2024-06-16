// @ts-check
import Phaser from 'phaser';
import { loadPenguinsNGunsAssets } from 'src/utils/resource-loaders/load-penguins-n-guns-assets.js';
import { Gun } from 'src/modules/Gun/Gun.js';
import { Penguin } from 'src/modules/Penguin/Penguin.js';
import Unit from 'src/objects/Unit.js';
import { AvoidCollisionSteering } from 'src/ai/steerings/avoid-collision-steering.js';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export class SteeringScene extends Phaser.Scene {
    /** @type {Array<Unit>} */
    gameObjects = [];

    constructor() {
        super({ key: 'SteeringScene' });
    }

    preload() {
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png');
        this.load.tilemapTiledJSON('map', 'dungeon_room.json');

        loadPenguinsNGunsAssets(this);
    }

    create() {
        const map = this.make.tilemap({ key: 'map' });
        console.log(map);

        const tileset = map.addTilesetImage('Dungeon_Tileset', 'tiles');

        const belowFloor = map.createLayer('Ground', tileset, 0, 0);
        const belowLayer = map.createLayer('Floor', tileset, 0, 0);
        const worldLayer = map.createLayer('Walls', tileset, 0, 0);
        const decals = map.createLayer('Decals', tileset, 0, 0);
        const aboveLayer = map.createLayer('Upper', tileset, 0, 0);
        const aboveUpper = map.createLayer('Leaves', tileset, 0, 0);
        this.tileSize = 32;

        worldLayer.setCollisionBetween(1, 500);
        aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        AvoidCollisionSteering.tilemapLayer = worldLayer;

        const gunConfig = new Gun({
            'id': '7b90d51a-13e6-4d5b-b1e6-af19a6c2e8d1',
            'name': 'Red Banner Grandma\'s Machine Gun',
            'assetKey': '9g',
            'weaponType': 'Machine Gun',
            'damage': 200,
            'cost': 3000,
            'range': 300
        });

        new Penguin(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, this.gameObjects, {
            bodyKey: '2c',
            gunConfig,
            stats: {},
            target: null,
            faceToTarget: false,
        })

        new Penguin(this, GAME_WIDTH / 2 + 200, GAME_HEIGHT / 2 - 100, this.gameObjects, {
            bodyKey: '2c',
            gunConfig,
            stats: {},
            target: null,
            faceToTarget: false,
        })

        new Penguin(this, GAME_WIDTH / 2 - 10, GAME_HEIGHT - 200, this.gameObjects, {
            bodyKey: '2c',
            gunConfig,
            stats: {},
            target: null,
            faceToTarget: false,
        })

        new Penguin(this, 100, GAME_HEIGHT / 2, this.gameObjects, {
            bodyKey: '2c',
            gunConfig,
            stats: {},
            target: null,
            faceToTarget: false,
        })


        // new Penguin(this, 100, 100, this.gameObjects, {
        //     bodyKey: '1c',
        //     gunConfig,
        //     stats: {},
        //     target: null,
        //     faceToTarget: false,
        // }),
        // new Penguin(this, GAME_WIDTH - 100, 100, this.gameObjects, {
        //     bodyKey: '3c',
        //     gunConfig,
        //     stats: {},
        //     target: null,
        //     faceToTarget: false,
        // }),
        // new Penguin(this, 100, GAME_HEIGHT - 100, this.gameObjects, {
        //     bodyKey: '4c',
        //     gunConfig,
        //     stats: {},
        //     target: null,
        //     faceToTarget: false,
        // }),
        // new Penguin(this, GAME_WIDTH - 100, GAME_HEIGHT - 100, this.gameObjects, {
        //     bodyKey: '5c',
        //     gunConfig,
        //     stats: {},
        //     target: null,
        //     faceToTarget: false,
        // })
        this.input.keyboard.on('keydown-D', event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
        });

        this.input.keyboard.on('keydown-S', event => {
            if (this.gameObjects) {
                this.gameObjects.forEach(function (element) {
                    if (element instanceof Penguin) {
                        element.separate();
                    }
                });
            }
        });

        this.input.keyboard.on('keydown-C', event => {
            if (this.gameObjects) {
                this.gameObjects.forEach(function (element) {
                    if (element instanceof Penguin) {
                        element.cohesion();
                    }
                });
            }
        });
    }

    update() {
        const deltaTime = (getTime() - this.lastTick) / 1000;

        if (this.gameObjects) {
            this.gameObjects.forEach(function (element) {
                if (element instanceof Penguin) {
                    element.update(0, deltaTime);
                    return;
                }
                element.update(deltaTime);
            });
        }

        this.lastTick = getTime();
    }

    /**
     * @param {number} tileX
     * @param {number} tileY
     */
    tilesToPixels(tileX, tileY) {
        return [tileX * this.tileSize, tileY * this.tileSize];
    }
}

function getTime() {
    return new Date().getTime();
}

/*const gunConfig = new Gun({
            'id': '7b90d51a-13e6-4d5b-b1e6-af19a6c2e8d1',
            'name': 'Red Banner Grandma\'s Machine Gun',
            'assetKey': '9g',
            'weaponType': 'Machine Gun',
            'damage': 200,
            'cost': 3000,
            'range': 300
        });
        this.gameObjects.push(
            new Penguin(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, this.gameObjects, {
                bodyKey: '2c',
                gunConfig,
                stats: {},
                target: null,
                faceToTarget: false,
            }),
            new Penguin(this, 100, 100, this.gameObjects, {
                bodyKey: '1c',
                gunConfig,
                stats: {},
                target: null,
                faceToTarget: false,
            }),
            new Penguin(this, GAME_WIDTH - 100, 100, this.gameObjects, {
                bodyKey: '3c',
                gunConfig,
                stats: {},
                target: null,
                faceToTarget: false,
            }),
            new Penguin(this, 100, GAME_HEIGHT - 100, this.gameObjects, {
                bodyKey: '4c',
                gunConfig,
                stats: {},
                target: null,
                faceToTarget: false,
            }),
            new Penguin(this, GAME_WIDTH - 100, GAME_HEIGHT - 100, this.gameObjects, {
                bodyKey: '5c',
                gunConfig,
                stats: {},
                target: null,
                faceToTarget: false,
            })
        );*/