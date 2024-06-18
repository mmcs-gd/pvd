import Vector2 from 'phaser/src/math/Vector2.js';

export class PatrolState {
    constructor(position, aggroDistance) {
        this.position = position;
        this.aggroDistance = aggroDistance;
    }

    update() {
    }

    conditionToTransform = (context) => {
        return context.enemies.any(enemy => this.positionVector().distance(enemy)).length() < this.aggroDistance;
    }

    positionVector = () => { return new Vector2(this.position.x, this.position.y) }
}