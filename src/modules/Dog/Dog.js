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
    /** @type {"forward" | "backward"} */ #orientation = "forward";
    /** @type {Phaser.GameObjects.Image} */ #sprite;

    /**
     * @param {Phaser.Scene} scene 
     * @param {number} x
     * @param {number} y
     * @param {string} spriteName
    */
    constructor(scene, x, y, spriteName) {
        super(scene, x, y)
        this.#sprite = scene.physics.add.image(0, 0, spriteName);
        this.#sprite.setScale(0.75);
        /** @type {Phaser.Physics.Arcade.Body}*/ (this.#sprite.body).setSize(180 * 1.25, 130 * 1.25);
        /** @type {Phaser.Physics.Arcade.Body}*/ (this.#sprite.body).setOffset(50, 48);
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

        // const steerings = [this.collisionSteering];
        const steerings = [];
        this.steeringManager = new SteeringManager(steerings, this, 60, 30);

        this.dogStateTable = new DogStateTable(this, this.context);
        this.stateMachine = new FiniteStateMachine(new DogStateTable(this, this.context))

        scene.add.existing(this);
    }

    get context() {
        return {
            // @ts-ignore
            enemies: this.scene.penguins
        }
    }

    update = (time = 0, delta) => {
        super.update(time, delta)

        this.setOrientation(
            !this.bodyVelocity || this.bodyVelocity.x > 0
                ? 'forward'
                : 'backward'
        );

        this.stateMachine.update();
    }

    get isForwardOrientation() {
        return this.#orientation === 'forward';
    }

    /**
   * @param {'forward' | 'backward'} orientation
   */
    setOrientation = (orientation) => {
        if (orientation === this.#orientation) return;

        this.#orientation = orientation;

        this.#sprite.setScale(
            this.isForwardOrientation ? 1 : -1,
            1
        );
    };

}