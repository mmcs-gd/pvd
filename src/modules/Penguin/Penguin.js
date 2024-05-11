// @ts-check
import Phaser from 'phaser';
import { gunsMap } from 'src/modules/Gun/constants/assetMap.js';
import { bodiesMap } from 'src/modules/Penguin/constants/assetMap.js';
import { Gun } from 'src/modules/Gun/Gun.js';

/* Regarding to 0,0 */
const PENGUIN_BELLY_BUTTON_POSITION = {
    x: 7,
    y: 40,
};

/**
 * @typedef {Object} Target
 * @property {number} x
 * @property {number} y
 */

/**
 * @class Penguin
 * @extends Phaser.GameObjects.Container
 * @description Penguin class
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} bodyKey
 * @param {string} gunKey
 * @param {Target} [target]
 * @returns {Penguin}
 */
export class Penguin extends Phaser.GameObjects.Container {
    /** @type {'forward' | 'backward'} */
    #orientation = 'forward';
    #faceToTarget = false;
    /** @type {Target | undefined} */
    #target;
    /** @type {Phaser.GameObjects.Image} */
    #penguinBody;
    /** @type {Phaser.GameObjects.Image} */
    #gun;
    /** @type {Gun} */
    #gunConfig;
    /** @type {Object} */
    #stats;

    get isForwardOrientation() {
        return this.#orientation === 'forward';
    }

    /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {Object} options
   * @param {Object | undefined} options.stats // sorry!
   * @param {string} options.bodyKey
   * @param {Gun} options.gunConfig
   * @param {Target} [options.target]
   * @param {boolean} [options.faceToTarget=false]
   */
    constructor(scene, x, y, { bodyKey, gunConfig, stats, target, faceToTarget }) {
        super(scene, x, y);

        if (!bodyKey || !bodiesMap[bodyKey]) {
            throw new Error(
                bodyKey ? `Body key ${bodyKey} not found` : 'Body key is required'
            );
        }
        this.#stats = stats;
        this.#gunConfig = gunConfig;
        this.#target = target;
        this.#faceToTarget = !!faceToTarget;

        this.#penguinBody = scene.add.image(0, 0, bodyKey);

        this.#gun = scene.add.image(
            PENGUIN_BELLY_BUTTON_POSITION.x,
            PENGUIN_BELLY_BUTTON_POSITION.y,
            this.#gunConfig.assetKey
        );

        this.#gun.setOrigin(0.1, 0.9);

        this.add(this.#penguinBody);
        this.add(this.#gun);

        scene.add.existing(this);
    }

    /**
   * @param {number} time
   * @param {number} delta
   */
    update = (time, delta) => {
        super.update(time, delta);

        const rotation = this.#target
            ? Phaser.Math.Angle.Between(
                this.x,
                this.y,
                this.#target.x,
                this.#target.y
            )
            : 0;

        this.#gun.rotation = rotation;

        this.setOrientation(
            !this.#target || this.#penguinBody.getBounds().centerX < this.#target.x
                ? 'forward'
                : 'backward'
        );
    };

    /**
   * @param {Target} target
   */
    setTarget = (target) => {
        this.#target = target;
    };

    /**
   * @param {boolean} faceToTarget
   */
    setFaceToTarget = (faceToTarget) => {
        this.#faceToTarget = faceToTarget;
    };

    /**
   * @param {string} bodyKey
   */
    setBody = (bodyKey) => {
        if (!bodiesMap[bodyKey]) throw new Error(`Body key ${bodyKey} not found`);

        this.#penguinBody.setTexture(bodyKey);
    };

    /**
   * @param {string} gunKey
   */
    setGun = (gunKey) => {
        if (!gunsMap[gunKey]) throw new Error(`Gun key ${gunKey} not found`);

        this.#gun.setTexture(gunKey);
    };

    /**
   * @param {'forward' | 'backward'} orientation
   */
    setOrientation = (orientation) => {
        if (orientation === this.#orientation) return;

        this.#orientation = orientation;

        this.#penguinBody.setScale(
            !this.#faceToTarget || this.isForwardOrientation ? 1 : -1,
            1
        );
        this.#gun.setScale(1, this.isForwardOrientation ? 1 : -1);
    };
}
