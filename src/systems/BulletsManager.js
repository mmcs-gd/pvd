import { Bullet } from '../objects/Bullet.js';

export class BulletsManager {
    /**
     * Preload bullet assets
     * @param {Phaser.Scene} scene
     */
    static preload(scene) {
        scene.load.image('bullet1', 'sprites/pack/Bullets/Bullets1.png');
        scene.load.image('bullet2', 'sprites/pack/Bullets/Bullets2.png');
        scene.load.image('bullet3', 'sprites/pack/Bullets/Bullets3.png');
    }

    /**
     * @param {Phaser.Scene} scene
     */
    static create(scene, blockedLayers = [], depth = 0) {
        this.bullets = [];
        this.blockedLayers = blockedLayers;
        this.depth = depth;
    }

    static update(deltaTime) {
        if (this.bullets) {
            this.bullets.forEach(function (element) {
                element.update(deltaTime);
            });
        }

        this.bullets = this.bullets.filter(b => !b.destroyed);
    }

    static spawnBullet(scene, sprite = 'bullet1', location = [400, 300], scale = 1, direction = [-1, 1], velocity = 400, distance = 400, fallingSpeed = 1) {
        this.bullets.push(new Bullet(scene, sprite, location, scale, direction, velocity, distance, this.blockedLayers, fallingSpeed, this.depth));
    }
}
