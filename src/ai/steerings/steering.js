import Vector2 from 'phaser/src/math/Vector2.js'
import SteeringManager from './steering-manager.js';

export default class Steering {
    /** @type {SteeringManager} */ steeringManager;

    constructor (owner, objects, force = 1) {
        this.owner = owner;
        this.objects = objects;
        this.force = force;
    }

    calculateImpulse () {
        return new Vector2(0, 0);
    }

}
