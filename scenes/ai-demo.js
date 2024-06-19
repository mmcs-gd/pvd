import Phaser from 'phaser';
import { BulletsManager } from '../src/systems/BulletsManager.js';
import { ParticlesSystem } from '../src/systems/ParticleSystem.js';
import { ParticleGunFire } from '../src/vfx/particleGunFire.js';
import { ParticleHitWall } from '../src/vfx/particleHitWall.js';
import { Penguin } from 'src/modules/Penguin/Penguin.js';
import { Gun } from '../src/modules/Gun/Gun.js';
import { ParticleGunCocking } from 'src/vfx/particleGunCocking.js';
import { loadPenguinsNGunsAssets } from 'src/utils/resource-loaders/load-penguins-n-guns-assets.js';
import { Dog } from 'src/modules/Dog/Dog.js';
import Unit from 'src/objects/Unit.js';
import Vector2 from 'phaser/src/math/Vector2.js'
import { AvoidCollisionSteering } from 'src/ai/steerings/avoid-collision-steering.js';

// debug bullets params
const bulletsDepth = 0; // set 11 - bullets will display above column

export default class AIDemoScene extends Phaser.Scene {
    /** @type {Array<Unit>} */ gameObjects;
    /** @type {Array<Penguin>} */ penguins;
    /** @type {Array<Dog>} */ dogs;

    constructor() {
        super({ key: 'AIDemoScene' });
    }

    preload() {
        loadPenguinsNGunsAssets(this);
        this.load.image('tiles', 'tileset/Dungeon_Tileset.png');
        this.load.tilemapTiledJSON('map', 'dungeon_room.json');

        this.load.image('dog01', 'sprites/pack/Characters/Dogs/Dog01/Idle/Idle_00.png');
        this.load.audio('gun_cocking', 'sfx/gun-cocking.mp3');

        BulletsManager.preload(this);

        // Preload assets for particle
        ParticlesSystem.preload(
            this,
            {
                'GunFire': new ParticleGunFire(),
                'HitWall': new ParticleHitWall(),
                'GunCocking': new ParticleGunCocking()
            }
        );
    }

    create() {
        ParticlesSystem.init();

        this.gameObjects = [];
        this.penguins = [];
        this.dogs = [];

        this.createMap();

        this.physics.world.bounds.width = this.map.widthInPixels;
        this.physics.world.bounds.height = this.map.heightInPixels;

        // add layers or array of game objects in second param, that mean blocking with bullets
        BulletsManager.create([this.worldLayer, this.aboveLayer, this.aboveUpper, this.gameObjects], bulletsDepth);

        this.createDog();
        this.createPenguin();
        this.lastTick = getTime();

        this.setupInputs();
    }

    setupInputs() {
        this.input.on('pointerdown', event => {
            if (event.leftButtonDown()) {
                this.penguin.useGun();
            }
        });

        this.input.keyboard.on('keydown-R', event => {
            this.penguin.reloadGun();
        });
    }

    createMap() {
        this.map = this.make.tilemap({ key: 'map' });

        this.tileset = this.map.addTilesetImage('Dungeon_Tileset', 'tiles');

        this.belowFloor = this.map.createLayer('Ground', this.tileset, 0, 0);
        this.belowLayer = this.map.createLayer('Floor', this.tileset, 0, 0);
        this.worldLayer = this.map.createLayer('Walls', this.tileset, 0, 0);
        this.decals = this.map.createLayer('Decals', this.tileset, 0, 0);
        this.aboveLayer = this.map.createLayer('Upper', this.tileset, 0, 0);
        this.aboveUpper = this.map.createLayer('Leaves', this.tileset, 0, 0);
        this.tileSize = 32;

        this.worldLayer.setCollisionBetween(1, 500);
        this.aboveLayer.setDepth(10);

        AvoidCollisionSteering.tilemapLayer = this.worldLayer;
    }

    createDog() {
        // spawn not animated dog for debug collision
        const dog = new Dog(this, 600, 300, "dog01");
        dog.dogStateTable.patrolState.patrolSteering.addPatrolPoint(new Phaser.Math.Vector2(600, 0))
        dog.dogStateTable.patrolState.patrolSteering.addPatrolPoint(new Phaser.Math.Vector2(600, 600))
        this.gameObjects.push(dog);
        this.dogs.push(dog)
    }

    createPenguin() {
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

        this.penguin = new Penguin(this, 200, 400, [], {
            bodyKey: '2c',
            gunConfig,
            stats: {},
            target: this.gameObjects[0],
            faceToTarget: true,
        });
        this.gameObjects.push(this.penguin);
        this.penguins.push(this.penguin);
    }

    update() {
        const deltaTime = (getTime() - this.lastTick) / 1000;

        if (this.gameObjects) {
            this.gameObjects.forEach(function (element) {
                element.update(deltaTime);
            });
        }

        BulletsManager.update(deltaTime);

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
