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
    /** @type {number} */ #damage;

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {Object} options
     * @param {number} options.health
     * @param {number} options.damage
     * @param {number} options.reward
     * @param {string} options.assetKey
    */
    constructor(scene, x, y, { health, damage, reward, assetKey }) {
        super(scene, x, y, health);

        this.#reward = reward;
        this.#damage = damage;

        this.#sprite = scene.physics.add.sprite(0, 0, assetKey);
        this.#sprite.setScale(0.75);
        /** @type {Phaser.Physics.Arcade.Body}*/ (this.#sprite.body).setSize(180 * 1.25, 130 * 1.25);
        /** @type {Phaser.Physics.Arcade.Body}*/ (this.#sprite.body).setOffset(50, 48);
        this.add(this.#sprite);

        const bounds = this.#sprite.getBounds();
        this.setSize(bounds.width, bounds.height);
         /** @type {Phaser.Physics.Arcade.Body}*/ (this.body).setSize(bounds.width, bounds.height);
         /** @type {Phaser.Physics.Arcade.Body}*/ (this.body).setOffset(bounds.width / 2, bounds.height / 2);

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

    getPhysicBody() {
        console.log("Physic body query");
        console.log(this.#sprite);
        return this.#sprite;
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

    /** @param {Unit} target */
    attack(target) {
        target.takeDamage(this.#damage);
    }

    die() {
        super.die();

        try {
            // @ts-ignore
            const index = this.scene.dogs.indexOf(this);
            // @ts-ignore
            this.scene.dogs.splice(index, 1);
        } catch (error) { /* empty */ }
    }
}
