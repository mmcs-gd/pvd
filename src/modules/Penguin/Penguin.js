// @ts-check
import Phaser from 'phaser';
import { gunsMap } from 'src/modules/Gun/constants/assetMap.js';
import { bodiesMap } from 'src/modules/Penguin/constants/assetMap.js';
import { Gun } from 'src/modules/Gun/Gun.js';
import { AvoidCollisionSteering } from 'src/ai/steerings/avoid-collision-steering.js';
import SteeringManager from 'src/ai/steerings/steering-manager.js';
import Unit from 'src/objects/Unit.js';
import Steering from 'src/ai/steerings/steering.js';
import CohesionSteering from 'src/ai/steerings/cohesion-steering.js';
import SeparationSteering from 'src/ai/steerings/separation-steering.js';
import { FiniteStateMachine } from 'src/ai/behaviour/state.js';
import { PenguinStateTable } from 'src/ai/behaviour/penguin-fsm.js';
import Vector2 from 'phaser/src/math/Vector2.js'

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
 * @extends Unit
 * @description Penguin class
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} bodyKey
 * @param {string} gunKey
 * @param {Target} [target]
 * @returns {Penguin}
 */
export class Penguin extends Unit {
    /** @type {'forward' | 'backward'} */
    #orientation = 'forward';
    #faceToTarget = false;
    /** @type {Target | undefined} */
    #target;
    /** @type {Phaser.Types.Physics.Arcade.ImageWithDynamicBody} */
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
   * @param {Array<Unit>} gameObjects
   * @param {Object} options
   * @param {Object | undefined} options.stats // sorry!
   * @param {string} options.bodyKey
   * @param {Gun} options.gunConfig
   * @param {Target} [options.target]
   * @param {boolean} [options.faceToTarget=false]
   */
    constructor(scene, x, y, gameObjects, { bodyKey, gunConfig, stats, target, faceToTarget }) {
        const { health } = stats; 
        super(scene, x, y, health);

        if (!bodyKey || !bodiesMap[bodyKey]) {
            throw new Error(
                bodyKey ? `Body key ${bodyKey} not found` : 'Body key is required'
            );
        }
        this.#stats = stats;
        this.#gunConfig = gunConfig;
        this.#target = target;
        this.#faceToTarget = !!faceToTarget;

        this.#penguinBody = scene.physics.add.sprite(0, 0, bodyKey);
        // this.#penguinBody.setCollideWorldBounds(true); // Пример настройки коллизий с миром
        // this.#penguinBody.setVelocity(0, 80);

        this.#gun = scene.add.image(
            PENGUIN_BELLY_BUTTON_POSITION.x,
            PENGUIN_BELLY_BUTTON_POSITION.y,
            this.#gunConfig.assetKey
        );

        this.#gun.setOrigin(0.1, 0.9);

        this.add(this.#penguinBody);
        this.add(this.#gun);

        let penguinBounds = this.#penguinBody.getBounds();
        this.setSize(penguinBounds.width, penguinBounds.height);
         /** @type {Phaser.Physics.Arcade.Body}*/ (this.body).setOffset(penguinBounds.width / 2, penguinBounds.height / 2);

        gameObjects.push(this);
        const force = 40;
        this.collisionSteering = new AvoidCollisionSteering(
            /** @type {Unit} */(this),
            gameObjects,
            force
        );
        this.cohesionSteering = new CohesionSteering(
            /** @type {Unit} */(this),
            gameObjects,
            force
        );
        this.separationSteering = new SeparationSteering(
            /** @type {Unit} */(this),
            gameObjects,
            force
        );
        let steerings = new Array();;
        steerings.push(this.collisionSteering, this.cohesionSteering, this.separationSteering);
        let steeringManager = new SteeringManager(steerings, this, 60, 30);
        // if (startVelocity.y != 0) {
        //     console.log(this.id, steeringManager.moveForcesCount);
        //     steeringManager.addMoveForce();
        // }
        this.steeringManager = steeringManager;
        this.collisionSteering.steeringManager = this.steeringManager;

        this.penguinStateTable = new PenguinStateTable(this, this.context);
        this.penguinStateMachine = new FiniteStateMachine(this.penguinStateTable);
        this.speed = 50;

        scene.add.existing(this);
    }

    get context() {
        return {
            // @ts-ignore
            enemies: this.scene.dogs ?? [],
            // @ts-ignore
            gameObjects: this.scene.gameObjects ?? []
        };
    }
    /**
   * @param {number} time
   * @param {number} delta
   */
    update = (time, delta) => {
        super.update(time, delta);
        this.updateGunRotation()
        this.#gunConfig.update(delta);

        this.setOrientation(
            !this.#target || this.#penguinBody.getBounds().centerX < this.#target.x
                ? 'forward'
                : 'backward'
        );

        this.penguinStateMachine.update(time, delta);
    };

    updateGunRotation() {
        const rotation = this.#target
            ? Phaser.Math.Angle.Between(
                this.x,
                this.y,
                this.#target.x,
                this.#target.y
            )
            : 0;

        this.#gun.rotation = rotation;
    }

    separate() {
        if (this.separationSteering.active) {
            this.separationSteering.active = false;
            this.steeringManager.removeMoveForce();
        }else{
            if(this.cohesionSteering.active){
                this.cohesionSteering.active = false;
                this.steeringManager.removeMoveForce();
            }
            this.separationSteering.active = true;
            this.steeringManager.addMoveForce();
        }
    }

    cohesion() {
        if (this.cohesionSteering.active) {
            this.cohesionSteering.active = false;
            this.steeringManager.removeMoveForce();
        }else{
            if(this.separationSteering.active){
                this.separationSteering.active = false;
                this.steeringManager.removeMoveForce();
            }
            this.cohesionSteering.active = true;
            this.steeringManager.addMoveForce();
        }
    }

    /** @param {Vector2} destination  */
    setDestination(destination) {
        // @ts-ignore
        this.penguinStateTable.goToTargetState.steering.targetPoint = destination;
    }

    /**
   * @param {Target} target
   */
    setTarget = (target) => {
        this.#target = target;
        this.updateGunRotation()
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

    /**
     * Shoot or other action of gun
     */
    useGun = () => {
        const offsetX = this.#gunConfig.muzzlePosition.x;
        const offsetY = this.isForwardOrientation ? -this.#gunConfig.muzzlePosition.y : this.#gunConfig.muzzlePosition.y;

        const bulletRotation = this.#gun.rotation;

        const cosRotation = Math.cos(bulletRotation);
        const sinRotation = Math.sin(bulletRotation);

        const bulletX = this.x + PENGUIN_BELLY_BUTTON_POSITION.x + (offsetX * cosRotation - offsetY * sinRotation);
        const bulletY = this.y + PENGUIN_BELLY_BUTTON_POSITION.y + (offsetX * sinRotation + offsetY * cosRotation);

        this.#gunConfig.shoot([bulletX, bulletY], bulletRotation);
    };

    /**
     * Reload gun
     */
    reloadGun = () => {
        this.#gunConfig.reload();
    };

    targetAcquired(target) {
        this.setTarget(target);
    }
    
    /** @param {Unit} target */
    attack(target) {
        const distance = this.distance(target);

        if (distance > this.#gunConfig.range) return;

        // this.setTarget(target);
        this.useGun();
    }
}
