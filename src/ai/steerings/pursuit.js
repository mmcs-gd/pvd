import Unit from 'src/objects/Unit.js';
import Steering from './steering.js';
import Vector2 from 'phaser/src/math/Vector2.js';

class Pursuit extends Steering {
    /** @type {Unit} */ #target;
    /** @type {number} */ #attackDistance;

    constructor (owner, objects, force = 1, attackDistance = 100) {
        super(owner, objects, force);
        this.ownerSpeed = owner.speed;
        this.#target = null;
        this.#attackDistance = attackDistance;
    }

    get target() {
        return this.#target;
    }

    set target(newTarget) {
        this.#target = newTarget;
        this.targetSpeed = newTarget.speed;
    }

    calculateImpulse() {
        if (this.target == null) return new Phaser.Math.Vector2(0, 0);

        const targetPosition = this.target.bodyPosition;
        const position = this.owner.bodyPosition;
        const distanceToTarget = targetPosition.distance(position);
        if (distanceToTarget <= this.#attackDistance) {
            return new Vector2(0, 0);
        }
        const directionToTarget = targetPosition.subtract(position).normalize();
        const impulse =  directionToTarget.scale(this.owner.mySpeed);
        return impulse
    }
    // calculateImpulse () {
    //     if (this.target == null) return new Vector2(0, 0);

    //     const searcherDirection = this.owner.bodyVelocity;
    //     const targetDirection = this.target.bodyVelocity;
    //     const toTarget = this.target.bodyPosition.subtract(this.owner.bodyPosition);
    //     const relativeHeading = searcherDirection.dot(targetDirection);

    //     if (toTarget.dot(targetDirection) < 0 || relativeHeading > -0.95)
    //     {
    //         const predictTime = toTarget.length() / (this.targetSpeed + this.ownerSpeed);
    //         toTarget.x += predictTime*targetDirection.x;
    //         toTarget.y += predictTime*targetDirection.y;
    //     }

    //     if (isNaN(toTarget.x))
    //         return [0, 0];
    //     const x = (Math.abs(toTarget.x) < 1) ? 0 : -Math.sign(toTarget.x)*this.ownerSpeed;
    //     const y = (Math.abs(toTarget.y) < 1) ? 0 : -Math.sign(toTarget.y)*this.ownerSpeed;

    //     return new Vector2(x, y);

    // }
}

export {Pursuit};
