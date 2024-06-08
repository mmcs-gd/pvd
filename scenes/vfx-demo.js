import Phaser from 'phaser';
import { BulletsManager } from '../src/systems/BulletsManager.js';
import { ParticlesSystem } from '../src/systems/ParticleSystem.js';
import { ParticleGunFire } from '../src/vfx/particleGunFire.js';
import { ParticleExplosion } from '../src/vfx/particleExplosion.js';
import { ParticleHitWall } from '../src/vfx/particleHitWall.js';
import { ParticleSmokeWhisp } from '../src/vfx/particleSmokeWhisp.js';

// debug bullets params
const bulletVelocity = 200;
const maxBulletDistance = 400;
const fallingSpeed = 0.5;
const shootingFreq = 0.4;
const bulletsScale = 0.8;
const bulletsDepth = 0; // set 11 - bullets will display above column

export default class VfxDemoScene extends Phaser.Scene {
    /** @type {Phaser.GameObjects.Sprite[]} */ gameObjects;

    constructor() {
        super({ key: 'VfxDemoScene' });
        // Counter for demonstrating particle effects
        this.counter = 0;
    }

    preload() {
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png');
        this.load.tilemapTiledJSON('map', 'dungeon_room.json');

        this.load.image('dog01', 'sprites/pack/Characters/Dogs/Dog01/Idle/Idle_00.png');
        this.load.audio('gun_cocking', 'sfx/gun-cocking.mp3');

        BulletsManager.preload(this);

        // Preload assets for particle
        this.particleSystem = new ParticlesSystem();
        this.particleSystem.preload(
            this,
            {
                'GunFire': new ParticleGunFire(),
                'Exposion': new ParticleExplosion(),
                'HitWall': new ParticleHitWall(),
                'SmokeWhisp': new ParticleSmokeWhisp()
            }
        );
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

        // add layers or array of game objects in second param, that mean blocking with bullets
        BulletsManager.create([worldLayer, aboveLayer, this.gameObjects], bulletsDepth);

        // Create a smoke whisp particle
        this.particleSystem.create('SmokeWhisp', 100, 200, 0, 0.25);

        // reloading for debug scene
        this.reloadingTime = 0;

        this.lastTick = getTime();
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
            this.counter += 1;
            // Bullets spawner
            if (this.counter % 5 !== 0 && this.counter < 5) {
                let randType = Math.random();

                const direction = [this.input.mousePointer.x - this.cameras.main.centerX, this.input.mousePointer.y - this.cameras.main.centerY];
                const rotation = Phaser.Math.Angle.Between(0, 0, direction[0], direction[1]);

                BulletsManager.spawnBullet(randType < 0.3 ? 'bullet1' : randType < 0.6 ? 'bullet2' : 'bullet3', [this.cameras.main.centerX, this.cameras.main.centerY], bulletsScale, direction, bulletVelocity, maxBulletDistance, fallingSpeed);
                this.particleSystem.create('GunFire', this.cameras.main.centerX, this.cameras.main.centerY, rotation, 0.15);
            }

            // Explosions spawner
            if (this.counter % 5 === 0) this.particleSystem.create('Exposion', 400, 400, 0, 0.3);

            // Play hit wall sound
            if (this.counter % 3 === 0 && this.counter > 10) {
                this.particleSystem.create('HitWall', 400, 400);
            }

            this.reloadingTime = shootingFreq;
        }

        // Reload gunfire
        this.input.keyboard.on('keydown-R', event => {
            if (this.counter > 0)
                this.sound.play('gun_cocking');
            this.counter = -1;
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
