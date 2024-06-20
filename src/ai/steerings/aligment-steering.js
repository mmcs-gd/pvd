
import Unit from 'src/objects/Unit.js';
import Steering from './steering.js';
import Vector2 from 'phaser/src/math/Vector2.js';

export default class AligmentSteering extends Steering {
    /**
     * 
     * @param {Unit} owner 
     * @param {*} objects 
     * @param {number} force 
    */
    constructor(owner, objects, force = 1) {
        super(owner, objects, force);
        this.MAX_DISTANCE = 300;
    }

    calculateImpulse() {
        let v = new Phaser.Math.Vector2(0, 0);
        let neighborCount = 0;
        this.objects.forEach(gameObject => {
            if (gameObject.constructor !== this.owner.constructor || !(gameObject instanceof Unit) || gameObject.id == this.owner.id) {
                return;
            }
            if (gameObject.distance(this.owner) < this.MAX_DISTANCE) {
                v = v.add(gameObject.bodyVelocity);
                neighborCount++;
            }
        });
        if (neighborCount == 0) {
            return v;
        }
        v.scale(1 / neighborCount);
        v.normalize();
        v.scale(this.force);
        return;
    }
}
