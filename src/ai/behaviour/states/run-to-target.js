import Vector2 from 'phaser/src/math/Vector2.js';

export class RunToTargetState {
    constructor(position, target, acceptableRange) {
        this.position = position;
        this.target = target;
        this.speed = 5.0;
        this.acceptableRange = acceptableRange;
    }

    update() {
        const toTarget = new Vector2(this.target.x - this.position.x, this.target.y - this.position.y).normalize();
        this.position.x += Math.floor(this.speed * toTarget.x);
        this.position.y += Math.floor(this.speed * toTarget.y);
    }
}