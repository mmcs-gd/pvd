
import Unit from 'src/objects/Unit.js';
import Steering from './steering.js';
import Vector2 from 'phaser/src/math/Vector2.js';

export default class SeparationSteering extends Steering {
    /** @type {boolean} */ active;

    /**
     * 
     * @param {Unit} owner 
     * @param {*} objects 
     * @param {number} force 
    */
    constructor(owner, objects, force = 1, maxDistance = 300) {
        super(owner, objects, force);
        this.MAX_DISTANCE = maxDistance;
    }

    calculateImpulse() {
        let v = new Phaser.Math.Vector2(0, 0);
        if(!this.active){
            return v;
        }
        let neighborCount = 0;
        this.objects.forEach(gameObject => {
            if (gameObject.constructor !== this.owner.constructor || !(gameObject instanceof Unit) || gameObject.id == this.owner.id) {
                return;
            }
            if (gameObject.distance(this.owner) < this.MAX_DISTANCE) {
                v = v.add(gameObject.bodyPosition.subtract(this.owner.bodyPosition));
                neighborCount++;
            }
        });
        if (neighborCount == 0) {
            return v;
        }

        v.scale(1 / neighborCount);
        v.scale(-1);
        v.normalize();
        v.scale(this.force);
        return v;
    }
}
