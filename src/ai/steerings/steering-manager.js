import Unit from "src/objects/Unit.js";
import Steering from "./steering.js";

export default class SteeringManager {
    /** @type {Array<Steering>}*/ steerings
    /** @type {Unit}*/ owner
    /** @type {number}*/ maxSpeed
    /** @type {number}*/ maxForce
    /** @type {number}*/ #moveForces


    /**
     * @param {Array<Steering>} steerings 
     * @param {Unit} owner 
     * @param {number} maxSpeed
     * @param {number} maxForce
     */
    constructor(steerings, owner, maxSpeed, maxForce) {
        this.steerings = steerings;
        this.owner = owner;
        this.maxSpeed = maxSpeed;
        this.maxForce = maxForce;
        this.#moveForces = 0;
    }

    get moveForcesCount(){
        return this.#moveForces;
    }

    addMoveForce() {
        this.#moveForces++;
    }

    removeMoveForce() {
        if (this.#moveForces > 0) {
            this.#moveForces--;
        }
    }

    update() {
        let steeringVelocity = new Phaser.Math.Vector2(0,0);
        for (let i = 0; i < this.steerings.length; i++) {
            steeringVelocity.add(this.steerings[i].calculateImpulse());
        }
        
        steeringVelocity = this.#truncate(steeringVelocity, this.maxForce);
        steeringVelocity = this.#truncate(steeringVelocity, this.maxSpeed);
        steeringVelocity.add(this.owner.bodyVelocity).scale(0.5);
        this.owner.setVelocity(steeringVelocity);
    }

    addObject(object) {
        this.steerings.forEach(steering => { steering.objects.push(object) });
    }

    /**
     * 
     * @param {Phaser.Math.Vector2} vector 
     * @param {number} max 
     */
    #truncate(vector, max) {
        if (vector.length() > max) {
            vector.normalize();
            vector.scale(max);
        }
        return vector;
    }
}