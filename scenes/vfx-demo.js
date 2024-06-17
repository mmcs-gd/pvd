import Phaser from 'phaser';
import { BulletsManager } from '../src/systems/BulletsManager.js';
import { ParticlesSystem } from '../src/systems/ParticleSystem.js';
import { ParticleGunFire } from '../src/vfx/particleGunFire.js';
import { ParticleExplosion } from '../src/vfx/particleExplosion.js';
import { ParticleHitWall } from '../src/vfx/particleHitWall.js';
import { ParticleSmokeWhisp } from '../src/vfx/particleSmokeWhisp.js';
import { Penguin } from 'src/modules/Penguin/Penguin.js';
import { Gun } from '../src/modules/Gun/Gun.js';
import { ParticleGunCocking } from 'src/vfx/particleGunCocking.js';

// debug bullets params
const bulletsDepth = 0; // set 11 - bullets will display above column

export default class VfxDemoScene extends Phaser.Scene {
    /** @type {Phaser.GameObjects.Sprite[]} */ gameObjects;
    /** @type {Array} */ unitGameObjects;

    constructor() {
        super({ key: 'VfxDemoScene' });
    }

    preload() {
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png');
        this.load.tilemapTiledJSON('map2', 'dungeon_room2.json');

        this.load.image('dog01', 'sprites/pack/Characters/Dogs/Dog01/Idle/Idle_00.png');
        this.load.audio('gun_cocking', 'sfx/gun-cocking.mp3');

        BulletsManager.preload(this);

        // Preload assets for particle
        ParticlesSystem.preload(
            this,
            {
                'GunFire': new ParticleGunFire(),
                'Exposion': new ParticleExplosion(),
                'HitWall': new ParticleHitWall(),
                'SmokeWhisp': new ParticleSmokeWhisp(),
                'GunCocking': new ParticleGunCocking()
            }
        );
    }

    create() {
        // Need to create animations for particles. Call before creating particles
        ParticlesSystem.init();

        this.gameObjects = [];
        this.unitGameObjects = [];
        const map = this.make.tilemap({ key: 'map2' });

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
        BulletsManager.create([worldLayer, aboveLayer, aboveUpper, this.gameObjects], bulletsDepth);

        // spawn not animated dog for debug collision
        const dog = this.add.sprite(600, 300, 'dog01');
        this.physics.add.existing(dog);
        dog.setScale(0.75);
        /** @type {Phaser.Physics.Arcade.Body}*/ (dog.body).setSize(180 * 1.25, 130 * 1.25);
        /** @type {Phaser.Physics.Arcade.Body}*/ (dog.body).setOffset(50, 48);

        this.gameObjects.push(dog);

        // Create a smoke whisp particle
        ParticlesSystem.create('SmokeWhisp', 100, 200, 0, 0.25);

        const gunConfig = new Gun({
            'id': '7b90d51a-13e6-4d5b-b1e6-af19a6c2e8d1',
            'name': 'Red Banner Grandma\'s Machine Gun',
            'assetKey': '9g',
            'weaponType': 'Machine Gun',
            'damage': 200,
            'cost': 3000,
            'range': 400,
            'bullets': 4,
            'bulletType': 'bullet2',
            'cooldownTime': 0.2,
            'muzzlePosition': {
                x: 55,
                y: 20
            }
        });

        this.target = this.add.circle(0, 0, 5, 0xff0000);

        this.penguin = new Penguin(this, 200, 300, this.unitGameObjects, {
            bodyKey: '2c',
            gunConfig,
            stats: {},
            target: this.target,
            faceToTarget: true,
        });

        this.lastTick = getTime();

        this.input.on('pointerdown', event => {
            if (event.leftButtonDown()) {
                this.penguin.useGun();
            }
        });

        this.input.keyboard.on('keydown-R', event => {
            this.penguin.reloadGun();
        });

        this.time.addEvent({
            delay: 3000,
            callback: () => ParticlesSystem.create('Exposion', 200, 500, 0, 0.3),
            loop: true
        });
    }

    update() {
        const deltaTime = (getTime() - this.lastTick) / 1000;

        if (this.gameObjects) {
            this.gameObjects.forEach(function (element) {
                element.update(deltaTime);
            });
        }

        BulletsManager.update(deltaTime);

        this.target.x = this.input.mousePointer.x;
        this.target.y = this.input.mousePointer.y;

        this.penguin.update(0, deltaTime);

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
