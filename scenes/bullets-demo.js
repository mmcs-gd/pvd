import Phaser from 'phaser';
import { BulletsManager } from '../src/systems/BulletsManager.js';

// debug bullets params
const bulletVelocity = 200;
const maxBulletDistance = 400;
const fallingSpeed = 0.5;
const shootingFreq = 0.4;
const bulletsScale = 1;
const bulletsDepth = 0; // set 11 - bullets will display above column

export default class BulletsDemoScene extends Phaser.Scene {
    /** @type {Phaser.GameObjects.Sprite[]} */ gameObjects;

    constructor() {
        super({ key: 'BulletsDemoScene' });
    }

    preload() {
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png');
        this.load.tilemapTiledJSON('map', 'dungeon_room2.json');

        this.load.image('dog01', 'sprites/pack/Characters/Dogs/Dog01/Idle/Idle_00.png');

        BulletsManager.preload(this);
    }

    create() {
        this.gameObjects = [];
        const map = this.make.tilemap({ key: 'map' });

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

        // spawn not animated dog for debug collision
        const dog = this.add.sprite(300, 500, 'dog01');
        this.physics.add.existing(dog);
        dog.setScale(0.5);
        dog.body.setSize(180, 130);
        dog.body.setOffset(50, 48);

        this.gameObjects.push(dog);

        // add layers or array of game objects in second param, that mean blocking with bullets
        BulletsManager.create(this, [worldLayer, aboveLayer, this.gameObjects], bulletsDepth);

        // reloading for debug scene
        this.reloadingTime = 0;

        this.lastTick = getTime();

        // test bullet reactions with realtime added objects
        setTimeout(() => {
            const newDog = this.add.sprite(600, 200, 'dog01');
            this.physics.add.existing(newDog);
            newDog.setScale(0.5);
            newDog.body.setSize(180, 130);
            newDog.body.setOffset(50, 48);
            this.gameObjects.push(newDog);
        }, 3000);
    }

    update() {
        const deltaTime = (getTime() - this.lastTick) / 1000;

        if (this.gameObjects) {
            this.gameObjects.forEach(function (element) {
                element.update(deltaTime);
            });
        }

        BulletsManager.update(deltaTime);

        this.reloadingTime -= deltaTime;

        if (this.reloadingTime < 0) {
            let randType = Math.random();

            BulletsManager.spawnBullet(this, randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [300, 200], bulletsScale, [0, -1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [300, 200], bulletsScale, [0, 1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [300, 200], bulletsScale, [1, 0], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [300, 200], bulletsScale, [-1, 0], bulletVelocity, maxBulletDistance, fallingSpeed);

            BulletsManager.spawnBullet(this, randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [300, 200], bulletsScale, [-1, -1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [300, 200], bulletsScale, [1, -1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [300, 200], bulletsScale, [1, 1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [300, 200], bulletsScale, [-1, 1], bulletVelocity, maxBulletDistance, fallingSpeed);

            this.reloadingTime = shootingFreq;
        }

        // Setup debug boundaries
        this.input.keyboard.on('keydown-D', event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();
        });

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
