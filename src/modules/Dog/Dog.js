import Phaser from 'phaser';


/**
 * @class Dog
 * @extends Phaser.GameObjects.Container
 * @description Dog class
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {Object} options
 * @param {number} options.health
 * @param {number} options.reward
 * @param {string} options.assetKey
 * @returns {Dog}
 */
export class Dog extends Phaser.GameObjects.Container {
    /** @type {number} */
    #health;
    /** @type {number} */
    #reward;
    /** @type {Phaser.GameObjects.Image} */
    #dogSprite;
    /** @type {boolean} */
    #isDead = false;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {Object} options
     * @param {number} options.health
     * @param {number} options.reward
     * @param {string} options.assetKey
     */
    constructor(scene, x, y, { health, reward, assetKey }) {
        super(scene, x, y);

        this.#health = health;
        this.#reward = reward;


        console.log(assetKey);
        if (!assetKey) {
            throw new Error('Asset key is required');
        }

        this.#dogSprite = scene.add.image(0, 0, assetKey);
        this.add(this.#dogSprite);

        scene.add.existing(this);
    }

    /**
     * @param {number} time
     * @param {number} delta
     */
    update = (time, delta) => {
        super.update(time, delta);

        // Logic to update the dog's position or behavior
    };

    /**
     * @returns {number}
     */
    getHealth = () => {
        return this.#health;
    };

    /**
     * @returns {number}
     */
    getReward = () => {
        return this.#reward;
    };

    /**
     * @param {number} damage
     */
    takeDamage = (damage) => {
        if (this.#isDead) return;

        this.#health -= damage;
        if (this.#health <= 0) {
            this.die();
            console.log("I died");
        }
    };

    die = () => {
        this.#isDead = true;
        this.setActive(false);
        this.setVisible(false);
    };

    /**
     * @returns {boolean}
     */
    isDead = () => {
        return this.#isDead;
    };

    getAssetKey = () =>
    {
        return this.#dogSprite;
    }
}
