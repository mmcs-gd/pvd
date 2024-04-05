import { BulletsManager } from '../src/systems/BulletsManager';

import dungeonRoomJson from '../assets/dungeon_room.json'
import tilemapPng from '../assets/tileset/Dungeon_Tileset.png'
import Idle_00 from './../assets/sprites/pack/Characters/Dogs/Dog01/Idle/Idle_00.png';

// debug bullets params
const bulletVelocity = 200;
const maxBulletDistance = 400;
const fallingSpeed = 0.5;
const shootingFreq = 0.4;
const bulletsScale = 1;
const bulletsDepth = 0; // set 11 - bullets will display above column

let BulletsDemoScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function BulletsDemoScene() {
        Phaser.Scene.call(this, { key: 'BulletsDemoScene' });
    },

    preload: function () {
        this.load.image("tiles", tilemapPng);
        this.load.tilemapTiledJSON("map", dungeonRoomJson);

        this.load.image("dog01", Idle_00);

        BulletsManager.preload(this);
    },

    create: function () {
        this.gameObjects = [];
        const map = this.make.tilemap({ key: "map" });

        const tileset = map.addTilesetImage("Dungeon_Tileset", "tiles");

        const belowLayer = map.createStaticLayer("Floor", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("Walls", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Upper", tileset, 0, 0);
        this.tileSize = 32;

        worldLayer.setCollisionBetween(1, 500);
        aboveLayer.setDepth(10);

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        // spawn not animated dog for debug collision
        const dog = this.add.sprite(300, 500, "dog01");
        this.physics.add.existing(dog);
        dog.setScale(0.5);
        dog.body.setSize(180, 130);
        dog.body.setOffset(50, 48);

        // add layers in second param which block with bullets
        BulletsManager.create(this, [worldLayer, aboveLayer, dog], bulletsDepth);

        // reloading for debug scene
        this.reloadingTime = 0;

        this.lastTick = getTime();
    },

    update: function () {
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

            BulletsManager.spawnBullet(this, randType < 0.3 ? "bullet1" : randType < 0.6 ? "bullet2" : "bullet3", [300, 200], bulletsScale, [0, -1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? "bullet1" : randType < 0.6 ? "bullet2" : "bullet3", [300, 200], bulletsScale, [0, 1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? "bullet1" : randType < 0.6 ? "bullet2" : "bullet3", [300, 200], bulletsScale, [1, 0], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? "bullet1" : randType < 0.6 ? "bullet2" : "bullet3", [300, 200], bulletsScale, [-1, 0], bulletVelocity, maxBulletDistance, fallingSpeed);

            BulletsManager.spawnBullet(this, randType < 0.3 ? "bullet1" : randType < 0.6 ? "bullet2" : "bullet3", [300, 200], bulletsScale, [-1, -1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? "bullet1" : randType < 0.6 ? "bullet2" : "bullet3", [300, 200], bulletsScale, [1, -1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? "bullet1" : randType < 0.6 ? "bullet2" : "bullet3", [300, 200], bulletsScale, [1, 1], bulletVelocity, maxBulletDistance, fallingSpeed);
            BulletsManager.spawnBullet(this, randType < 0.3 ? "bullet1" : randType < 0.6 ? "bullet2" : "bullet3", [300, 200], bulletsScale, [-1, 1], bulletVelocity, maxBulletDistance, fallingSpeed);

            this.reloadingTime = shootingFreq;
        }

        // Setup debug boundaries
        this.input.keyboard.on("keydown-D", event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();
        });

        this.lastTick = getTime();
    },

    tilesToPixels(tileX, tileY) {
        return [tileX * this.tileSize, tileY * this.tileSize];
    }
})

function getTime() {
    return new Date().getTime();
}

export default BulletsDemoScene