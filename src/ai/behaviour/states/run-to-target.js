import Vector2 from 'phaser/src/math/Vector2.js';
import SteeringManager from 'src/ai/steerings/steering-manager.js';
import Unit from 'src/objects/Unit.js';
import { State } from '../state.js';
import { Pursuit } from 'src/ai/steerings/pursuit.js';

function findMinBy(array, fn) {
  return array.reduce((maxElem, currentElem) => {
    return fn(currentElem) < fn(maxElem) ? currentElem : maxElem;
  });
}

export class RunToTargetState extends State {
    /** @type {SteeringManager} */ steeringManager;
    /** @type {any} */ context;
    /** @type {Unit} */ target;
    /** @type {any} */ lastAttackTime = 0;
    
    constructor(owner, acceptableRange) {
        super(owner);
        this.steeringManager = owner.steeringManager;
        this.acceptableRange = acceptableRange;
    }

    onStateEnter = (context) => {
        console.log("Run to target state enter!");
        this.context = context;
        this.target = this.findClosestTarget();
        this.pursuitSteering = new Pursuit(this.owner, this.context.gameObjects, 40);
        this.pursuitSteering.target = this.target;
        this.steeringManager.addSteering(this.pursuitSteering);
        this.steeringManager.removeMoveForce();
        console.log([...this.steeringManager.steerings]);
    }

    onStateExit = (context) => {
        console.log("Run to target state exit!");
        this.steeringManager.removeLastSteering();
        // this.steeringManager.removeMoveForce();
        this.pursuitSteering = null;
    }

    update(time, delta) {
        const target = this.findClosestTarget();
        if (target !== this.target) {
            console.log("New target!");
            this.target = target;
            this.pursuitSteering.target = target;
        }
        this.steeringManager.update();
        if (this.owner.bodyVelocity.length() < 10) {
            this.enqueAttack(time, delta)
        }
    }

    findClosestTarget() {
        return findMinBy(this.context.enemies, (enemy) => {
            enemy.bodyPosition.distance(this.owner.bodyPosition);
        });
    }

    enqueAttack(time, delta) {
        const diff = time - this.lastAttackTime;
        if (diff > 2000){
            console.log("Attack!");
            this.lastAttackTime = time;
        }
    }
}