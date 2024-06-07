import Bullet from '../objects/Bullet.js';

export class BulletsManager {
    /** @type {Phaser.Types.Physics.Arcade.ArcadeColliderType[]} */ blockedLayers
    /** @type {Phaser.Scene} */ scene
    /** @type {Bullet[]} */ bullets
    /** @type {number} */ depth


    /**
     * Preload bullet assets
     * @param {Phaser.Scene} scene
     */
    static preload(scene) {
        this.scene = scene;

        this.scene.load.image('bullet1', 'sprites/pack/Bullets/Bullets1.png');
        this.scene.load.image('bullet2', 'sprites/pack/Bullets/Bullets2.png');
        this.scene.load.image('bullet3', 'sprites/pack/Bullets/Bullets3.png');
    }

    /**
     * Define blocked layers or objects for all bullets and z-order of bullet layer
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType[]} blockedLayers 
     * @param {number} depth 
     */
    static create(blockedLayers = [], depth = 0) {
        this.bullets = [];
        this.blockedLayers = blockedLayers;
        this.depth = depth;
    }

    /**
     * Call update position for each bullet and filter ones
     * @param {number} deltaTime 
     */
    static update(deltaTime) {
        if (this.bullets) {
            this.bullets.forEach(function (element) {
                element.update(deltaTime);
            });
        }

        this.bullets = this.bullets.filter(b => !b.destroyed);
    }

    /**
     * Spwan bullet with shared params from manager
     * @param {string} sprite 
     * @param {number[]} location 
     * @param {number} scale 
     * @param {number[]} direction 
     * @param {number} velocity 
     * @param {number} distance 
     * @param {number} fallingSpeed 
     */
    static spawnBullet(sprite = 'bullet1', location = [400, 300], scale = 1, direction = [-1, 1], velocity = 400, distance = 400, fallingSpeed = 1) {
        this.bullets.push(new Bullet(this.scene, sprite, location, scale, direction, velocity, distance, this.blockedLayers, fallingSpeed, this.depth));
    }
}
