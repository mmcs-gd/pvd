
import Unit from 'src/objects/Unit.js';
import Steering from './steering.js';
import Vector2 from 'phaser/src/math/Vector2.js';

class AvoidCollisionSteering extends Steering {
    static /** @type {Phaser.Tilemaps.TilemapLayer} */ tilemapLayer
    /** @type {Phaser.Math.Vector2} */ #aheadTarget

    /**
     * 
     * @param {Unit} owner 
     * @param {*} objects 
     * @param {number} force 
    */
    constructor(owner, objects, force = 1) {
        super(owner, objects, force);
        this.MAX_SEE_AHEAD = owner.radius * 2;
        this.MAX_AVOID_FORCE = force;
        this.last = Phaser.Math.Vector2.ZERO.clone();
    }

    get aheadTarget() {
        return this.#aheadTarget;
    }


    calculateImpulse() {
        let avoidance = new Phaser.Math.Vector2(0, 0);
        if (this.steeringManager.moveForcesCount < 1) {
            return avoidance;
        }
        let aheadAdd = this.owner.normalizedVelocity.scale(this.MAX_SEE_AHEAD);
        let ahead = this.owner.bodyPosition.add(aheadAdd);
        this.#aheadTarget = ahead.clone();
        let ahead2 = this.owner.bodyPosition.add(aheadAdd.clone().scale(0.5));
        let mostThreatening = this.findMostThreateningObstacle(this.objects, ahead, ahead2);
        if (mostThreatening != null) {
            let threatX, threatY;
            if (mostThreatening instanceof Unit) {
                threatX = mostThreatening.bodyPosition.x;
                threatY = mostThreatening.bodyPosition.y;
            } else if (mostThreatening instanceof Phaser.Tilemaps.Tile) {
                threatX = mostThreatening.getCenterX();
                threatY = mostThreatening.getCenterY();
            } else {
                avoidance.scale(0); // nullify the avoidance force 
                return avoidance;
            }
            avoidance.x = ahead.x - threatX;
            avoidance.y = ahead.y - threatY;
            avoidance.normalize();
            avoidance.scale(this.MAX_AVOID_FORCE);
        } else {
            avoidance.scale(0); // nullify the avoidance force 
        }

        if (this.last != Phaser.Math.Vector2.ZERO && avoidance == Phaser.Math.Vector2.ZERO) {
            avoidance = this.last.clone();
            this.last = Phaser.Math.Vector2.ZERO;
        }
        this.last = avoidance.clone();

        return avoidance;
    }

    /**
     * 
     * @param {Array<Unit>} gameObjects 
     * @param {Phaser.Math.Vector2} ahead1 
     * @param {Phaser.Math.Vector2} ahead2 
     * @returns 
     */
    findMostThreateningObstacle(gameObjects, ahead1, ahead2) {
        let mostThreatening = null;
        for (let i = 0; i < gameObjects.length; i++) {
            let obstacle = gameObjects[i];
            let collision = obstacle.intersects(ahead1, ahead2, this.owner.id);
            // "position" is the character's current position 
            if (collision && (mostThreatening == null || this.owner.distance(obstacle) < this.owner.distance(mostThreatening))) {
                mostThreatening = obstacle;
            }
        }

        let fpoint = ahead1;
        let spoint = ahead2;
        const line = new Phaser.Geom.Line(fpoint.x, fpoint.y, spoint.x, spoint.y);
        let tiles = /** @type {Phaser.Tilemaps.TilemapLayer} */ (AvoidCollisionSteering.tilemapLayer).getTilesWithinShape(line);
        for (let i = 0; i < tiles.length; i++) {
            let obstacle = tiles[i];
            if (obstacle.index == -1) {
                continue;
            }
            let obstacleBounds = obstacle.getBounds();
            const line = new Phaser.Geom.Line(ahead1.x, ahead1.y, ahead2.x, ahead2.y);
            let collision = Phaser.Geom.Intersects.LineToRectangle(line, obstacleBounds);
            if (collision && (mostThreatening == null || this.owner.distance(obstacle) < this.owner.distance(mostThreatening))) {
                mostThreatening = obstacle;
            }
        }

        return mostThreatening;
    }
}

export { AvoidCollisionSteering };
