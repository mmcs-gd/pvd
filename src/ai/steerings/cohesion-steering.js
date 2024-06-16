
import Unit from 'src/objects/Unit.js';
import Steering from './steering.js';
import Vector2 from 'phaser/src/math/Vector2.js';

export default class CohesionSteering extends Steering {
    /** @type {boolean} */ active;

    /**
     * 
     * @param {Unit} owner 
     * @param {*} objects 
     * @param {number} force 
    */
    constructor(owner, objects, force = 1, maxDistance = 400) {
        super(owner, objects, force);
        this.MAX_DISTANCE = maxDistance;
        this.MIN_DISTANCE = this.owner.radius * 4;
    }

    calculateImpulse() {
        let v = new Phaser.Math.Vector2(0, 0);
        if (!this.active) {
            return v;
        }
        let neighborCount = 0;
        this.objects.forEach(gameObject => {
            if (gameObject.constructor !== this.owner.constructor || !(gameObject instanceof Unit) || gameObject.id == this.owner.id) {
                return;
            }
            if (gameObject.distance(this.owner) < this.MAX_DISTANCE) {
                v = v.add(gameObject.bodyPosition);
                neighborCount++;
            }
        });
        if (neighborCount == 0) {
            return v;
        }

        v.scale(1 / neighborCount);
        let mass = v.clone();
        if (mass.distance(this.owner) < this.MIN_DISTANCE) {
            this.active = false;
            return new Phaser.Math.Vector2(0, 0);
        }
        v.subtract(this.owner.bodyPosition);
        v.normalize();
        v.scale(this.force);
        return v;
    }
}
