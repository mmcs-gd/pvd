import Vector2 from 'phaser/src/math/Vector2.js'
import Steering from './steering.js';
import Unit from 'src/objects/Unit.js';

export class PatrolSteering extends Steering {
    /** @type {Array<Vector2>} */ patrolPoints;
    /** @type {integer} */ currentTagetIndex;

    /** @param {Unit} owner */
    constructor (owner, objects, force = 1) {
        super(owner, objects, force);
        this.patrolPoints = [];
        this.currentTargetIndex = null;
        this.EPS = 5.0;
    }

    /** @param {Vector2} pointVector */
    addPatrolPoint(pointVector) {
        this.patrolPoints.push(pointVector.clone());
        if (this.currentTargetIndex == null) {
            this.currentTargetIndex = 0;
        }
    }


    /** @type {Vector2} currentTarget() */
    get currentTarget() {
        if (this.currentTargetIndex == null) return null;

        if (this.currentTargetIndex == this.patrolPoints.length)
            this.currentTargetIndex = 0;

        return this.patrolPoints[this.currentTargetIndex].clone();
    }

    calculateImpulse () {
        if (this.currentTarget == null) return new Phaser.Math.Vector2(0, 0);

        console.log(this.currentTarget);
        const distance = this.currentTarget.distance(this.owner.bodyPosition);
        if (distance <= this.EPS) {
            this.currentTargetIndex++;
            this.currentTarget;
        }
        const directionToTarget = this.currentTarget.subtract(this.owner.bodyPosition).normalize();
        const impulse = directionToTarget.scale(this.owner.mySpeed);
        return impulse
    }
}