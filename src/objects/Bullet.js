import Phaser from 'phaser';
import { ParticlesSystem } from 'src/systems/ParticleSystem.js';

export default class Bullet {
    /** @type {Phaser.Scene} */              scene;
    /** @type {number} */                    scale;
    /** @type {number} */                    distance;
    /** @type {boolean} */                   destroyed;
    /** @type {number} */                    velocity;
    /** @type {Phaser.GameObjects.Sprite} */ sprite;
    /** @type {number} */                    fallingSpeed;
    /** @type {number} */                    depth;

    /**
     * @param {Phaser.Scene} scene
     * @param {string} sprite
     * @param {number[]} location
     * @param {number} scale
     * @param {number} velocity
     * @param {number} distance
     * @param {Phaser.Types.Physics.Arcade.ArcadeColliderType[]} blockedLayers
     * @param {number} fallingSpeed speed of falling bullet at the end of life time
     * @param {number} depth
     */
    constructor(scene, sprite = 'bullet1', location = [400, 300], scale = 1, rotation = 0, velocity = 400, distance = 400, blockedLayers = [], fallingSpeed = 1, depth = 0) {
        this.scene = scene;
        this.scale = scale;
        this.distance = distance;
        this.fallingSpeed = fallingSpeed;
        this.velocity = velocity;

        this.sprite = scene.add.sprite(location[0], location[1], sprite);
        this.sprite.setDepth(depth);
        this.sprite.setOrigin(0, 0.5);
        this.sprite.rotation = rotation; // rotated bullet to direction vector
        this.sprite.scale = this.scale;

        this.destroyed = false;

        // setting circle collider. P.S. collider can't be rotated with "arcade" physics!!!
        // setCircle make circle collider with position from the top-left of the game object (this.sprite)
        const colliderRadius = 6;
        const offsetY = (this.sprite.height - 2 * colliderRadius) / 2;

        this.scene.physics.add.existing(this.sprite);

        /** @type {Phaser.Physics.Arcade.Body}*/ (this.sprite.body).setCircle(colliderRadius, - this.sprite.height / 2 + offsetY + Math.cos(this.sprite.rotation) * (this.sprite.width - colliderRadius), offsetY + Math.sin(this.sprite.rotation) * (this.sprite.width - colliderRadius));
        /** @type {Phaser.Physics.Arcade.Body}*/ (this.sprite.body).collideWorldBounds = false;

        // set layers, which block with bullet
        blockedLayers.forEach(layer => {
            console.log("Layer");
            console.log(layer);
            scene.physics.add.collider(this.sprite, layer, this.onHit, null, scene);
        });
    }

    /**
     * Please, I need your delta time
     * @param {number} deltaTime
     */
    update(deltaTime) {
        this.distance -= this.velocity * deltaTime;

        // simulate bullet falling at the end of life time
        this.sprite.alpha = clamp(this.distance / this.velocity / this.fallingSpeed, 0, 1);
        this.sprite.scale = this.scale * clamp(this.distance / this.velocity / this.fallingSpeed, 0, 1);

        this.sprite.x = this.sprite.x + deltaTime * this.velocity * Math.cos(this.sprite.rotation);
        this.sprite.y = this.sprite.y + deltaTime * this.velocity * Math.sin(this.sprite.rotation);

        this.destroyed = this.destroyed || this.distance < 0;
        if (this.destroyed) {
            this.sprite.destroy();
        }
    }

    /**
     * Call other object collision event and destroy self
     * @param {	Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody} self
     * @param {	Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody} other
     */
    onHit(self, other) {
        console.log("On hit with:");
        console.log(other);

        /** @type {Bullet}*/ (/** @type {unknown}*/ (self)).destroyed = true;
        self.destroy(); //
        ParticlesSystem.create('HitWall', 400, 400);

        // Call onHit method of other object
        try {
            /** @type {Object}*/ (other).onHit();
        } catch (error) { /* empty */ }
    }
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
