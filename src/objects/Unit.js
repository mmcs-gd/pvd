import Vector2 from 'phaser/src/math/Vector2.js'
import SteeringManager from 'src/ai/steerings/steering-manager.js';

/**
 * @class Unit
 * @extends Phaser.GameObjects.Container
 * @description Unit class
 * @returns {Unit}
 */
export default class Unit extends Phaser.GameObjects.Container {
    /** @type {Phaser.Physics.Arcade.Body} */ #physicBody
    /** @type {SteeringManager} */ #steeringManager
    /** @type {number} */ #id
    /** @type {number} */ #radius
    /** @type {number} */ mySpeed;
    /** @type {number} */ #health;
    /** @type {boolean} */ #isDead = false;

    static nextId = 1;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     */
    constructor(scene, x, y, health) {
        super(scene, x, y);
        this.#id = Unit.nextId++;
        this.#health = health;

        scene.physics.world.enable(this);

        this.#physicBody = /** @type {Phaser.Physics.Arcade.Body} */(this.body);
        this.#physicBody.setCollideWorldBounds(true);
    }

    setWidthHeight(width, height) {
        this.width = width;
        this.height = height;
        this.#radius = Math.min(this.width, this.height) * 0.5;
    }

    get id() {
        return this.#id;
    }

    get radius() {
        return this.#radius;
    }

    get walking() {
        return this.#physicBody.velocity.x != 0 || this.#physicBody.velocity.y != 0;
    }

    get steeringManager() {
        return this.#steeringManager;
    }

    /**
     * @param {SteeringManager} newValue 
     */
    set steeringManager(newValue) {
        this.#steeringManager = newValue;
    }

    getPhysicBody() {
        return null;
    }

    get bodyPosition() {
        return this.#physicBody.position.clone();
    }

    get speed() {
        return this.#physicBody.speed;
    }

    set speed(speed) {
        this.#physicBody.speed = speed;
        this.mySpeed = speed;
    }

    get normalizedVelocity() {
        return this.#physicBody.velocity.clone().normalize();
    }

    get bodyVelocity() {
        return this.#physicBody.velocity.clone();
    }

    /** 
     * @param {Phaser.Math.Vector2} newValue
    */
    setVelocity(newValue) {
        this.#physicBody.setVelocity(newValue.x, newValue.y);
    }

    /**
    * @param {Vector2} p1
    * @param {Vector2} p2
    * @param {number} excludeId 
    */
    intersects(p1, p2, excludeId) {
        if (this.#id == excludeId) {
            return false;
        }
        const line = new Phaser.Geom.Line(p1.x, p1.y, p2.x, p2.y);
        let leftTopPoint = new Phaser.Math.Vector2(this.bodyPosition.x - this.width * 0.5, this.bodyPosition.y - this.height * 0.5);
        const rect = new Phaser.Geom.Rectangle(leftTopPoint.x, leftTopPoint.y, this.width, this.height);
        return Phaser.Geom.Intersects.LineToRectangle(line, rect);
    }

    distance(other) {
        let otherX, otherY;
        if (other instanceof Phaser.Tilemaps.Tile) {
            let tile = /** @type {Phaser.Tilemaps.Tile} */ (other);
            otherX = tile.getCenterX();
            otherY = tile.getCenterY();

        } else if (other instanceof Unit) {
            otherX = other.bodyPosition.x;
            otherY = other.bodyPosition.y;
        } else {
            return -1;
        }

        const dx = otherX - this.bodyPosition.x;
        const dy = otherY - this.bodyPosition.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * @returns {number}
     */
    get Health() {
        return this.#health;
    }

    /**
     * @returns {boolean}
     */
    get isDead() {
        return this.#isDead;
    }

    /**
     * @param {number} damage
     */
    takeDamage(damage) {
        console.log("Try take damage");
        console.log(this.#health);
        console.log(damage);

        if (this.#isDead) return;

        this.#health -= damage;
        if (this.#health <= 0) {
            this.die();
            console.log('I died');
        }

        console.log("HP left:");
        console.log(this.#health);
    }

    die() {
        this.#isDead = true;
        this.setActive(false);
        this.setVisible(false);
        try {
            // @ts-ignore
            const index = this.scene.gameObjects.indexOf(this);
            // @ts-ignore
            this.scene.gameObjects.splice(index, 1);
        } catch (error) { /* empty */ }
    }

    /** @param {Unit} target */
    targetAcquired(target) {}

    /** @param {Unit} target */
    attack(target) {
        console.log("Attack!");
    }
}