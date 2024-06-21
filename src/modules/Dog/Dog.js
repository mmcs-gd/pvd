import Phaser from 'phaser';
import { DogStateTable } from 'src/ai/behaviour/dog-fsm.js';
import { StateTable } from 'src/ai/behaviour/state-table.js';
import { FiniteStateMachine } from 'src/ai/behaviour/state.js';
import { AvoidCollisionSteering } from 'src/ai/steerings/avoid-collision-steering.js';
import SteeringManager from 'src/ai/steerings/steering-manager.js';
import Unit from 'src/objects/Unit.js';

export class Dog extends Unit {
    /** @type {DogStateTable} */ dogStateTable;
    /** @type {FiniteStateMachine} */ stateMachine;
    /** @type {"forward" | "backward"} */ #orientation = 'forward';
    /** @type {Phaser.GameObjects.Image} */ #sprite;
    /** @type {number} */ #reward;

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
        super(scene, x, y, health);

        this.#reward = reward;

        this.#sprite = scene.physics.add.image(0, 0, assetKey);
        this.add(this.#sprite);

        const bounds = this.#sprite.getBounds();
        this.setWidthHeight(bounds.width, bounds.height);

        const force = 40;
        this.speed = 50.0;
        this.collisionSteering = new AvoidCollisionSteering(
            /** @type {Unit} */(this),
            // @ts-ignore
            scene.gameObjects,
            force
        );

        const steerings = [this.collisionSteering];
        this.steeringManager = new SteeringManager(steerings, this, 60, 30);

        this.dogStateTable = new DogStateTable(this, this.context);
        this.stateMachine = new FiniteStateMachine(this.dogStateTable);

        scene.add.existing(this);
    }

    get context() {
        return {
            // @ts-ignore
            enemies: this.scene.penguins ?? [],
            // @ts-ignore
            gameObjects: this.scene.gameObjects ?? []
        };
    }

    /**
     * @param {number} [delta]
     */
    update(time = 0, delta) {
        super.update(time, delta);

        if (this.bodyVelocity.length() > 10) {
            this.setOrientation(
                !this.bodyVelocity || this.bodyVelocity.x < 0
                    ? 'forward'
                    : 'backward'
            );
        }

        this.stateMachine.update(time, delta);
    }

    get isForwardOrientation() {
        return this.#orientation === 'forward';
    }

    /**
     * @returns {number}
     */
    get Reward() {
        return this.#reward;
    }

    getAssetKey() {
        return this.#sprite;
    }

    /**
     * @param {'forward' | 'backward'} orientation
     */
    setOrientation(orientation) {
        if (orientation === this.#orientation) return;

        this.#orientation = orientation;

        this.#sprite.setScale(
            this.isForwardOrientation ? 1 : -1,
            1
        );
    }
}
