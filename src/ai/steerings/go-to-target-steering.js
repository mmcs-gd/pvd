import Vector2 from 'phaser/src/math/Vector2.js'
import Steering from './steering.js';
import Unit from 'src/objects/Unit.js';

export class GoToTargetSteering extends Steering {
    /** @type {Vector2} */ #targetPoint;
    /** @type {integer} */ currentTagetIndex;

    /** @param {Unit} owner */
    constructor (owner, objects, force = 1) {
        super(owner, objects, force);
        this.#targetPoint = null;
        this.currentTargetIndex = null;
        this.EPS = 5.0;
    }

    /** @param {Vector2} pointVector */
    set targetPoint(pointVector) {
        this.#targetPoint = pointVector;
    }

    get targetPoint() {
        if (this.#targetPoint === null) return null;

        return this.#targetPoint.clone();
    }

    calculateImpulse () {
        if (this.targetPoint == null) return new Phaser.Math.Vector2(0, 0);

        if (this.targetPoint.distance(this.owner.bodyPosition) <= this.EPS) {
            return new Phaser.Math.Vector2(0, 0); // reached the target
        }

        const directionToTarget = this.targetPoint.subtract(this.owner.bodyPosition).normalize();
        const impulse =  directionToTarget.scale(this.owner.mySpeed);
        return impulse
    }
}